import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildSeed } from "./seed";
import type {
  Category,
  Course,
  Enrollment,
  Lesson,
  LmsData,
  Section,
  User,
} from "./types";
import { extractYoutubeId } from "./youtube";

const STORAGE_KEY = "lms.demo.v1";
const SESSION_KEY = "lms.session.v1";

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Ctx = {
  ready: boolean;
  data: LmsData;
  currentUser: User | null;

  signIn: (email: string, password: string, remember: boolean) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "avatar">>) => void;
  changePassword: (current: string, next: string) => { ok: boolean; error?: string };

  createCategory: (name: string, description: string) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => { ok: boolean; error?: string };

  createCourse: (input: Omit<Course, "id" | "slug" | "createdAt" | "updatedAt">) => Course;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;

  createSection: (courseId: string, title: string) => void;
  updateSection: (id: string, title: string) => void;
  deleteSection: (id: string) => void;
  moveSection: (id: string, dir: -1 | 1) => void;

  createLesson: (
    sectionId: string,
    input: { title: string; description: string; youtubeUrl: string; duration: string; freePreview: boolean; published: boolean },
  ) => { ok: boolean; error?: string };
  updateLesson: (id: string, patch: Partial<Lesson> & { youtubeUrl?: string }) => { ok: boolean; error?: string };
  deleteLesson: (id: string) => void;
  moveLesson: (id: string, dir: -1 | 1) => void;

  enroll: (courseId: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  setLessonCompleted: (courseId: string, lessonId: string, completed: boolean) => void;
  setStudentActive: (studentId: string, active: boolean) => void;
};

const LmsContext = createContext<Ctx | null>(null);

export function LmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LmsData>(() => buildSeed());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as LmsData);
      const session =
        localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
      if (session) setCurrentUserId(session);
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [data]);

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === currentUserId) ?? null,
    [data.users, currentUserId],
  );

  const persistSession = (id: string | null, remember = true) => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (id) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, id);
  };

  const signIn: Ctx["signIn"] = useCallback(
    (email, password, remember) => {
      const user = data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user || user.password !== password)
        return { ok: false, error: "Incorrect email or password." };
      if (!user.active) return { ok: false, error: "This account has been disabled." };
      persistSession(user.id, remember);
      setCurrentUserId(user.id);
      return { ok: true };
    },
    [data.users],
  );

  const register: Ctx["register"] = useCallback(
    (name, email, password) => {
      const exists = data.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) return { ok: false, error: "An account with this email already exists." };
      const user: User = {
        id: uid("user"),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "student",
        active: true,
        createdAt: nowIso(),
      };
      setData((d) => ({ ...d, users: [...d.users, user] }));
      persistSession(user.id, true);
      setCurrentUserId(user.id);
      return { ok: true };
    },
    [data.users],
  );

  const signOut = useCallback(() => {
    persistSession(null);
    setCurrentUserId(null);
  }, []);

  const patchUser = (id: string, patch: Partial<User>) =>
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));

  const value: Ctx = {
    ready,
    data,
    currentUser,
    signIn,
    register,
    signOut,

    updateProfile: (patch) => {
      if (currentUserId) patchUser(currentUserId, patch);
    },
    changePassword: (current, next) => {
      if (!currentUser) return { ok: false, error: "Not signed in." };
      if (currentUser.password !== current) return { ok: false, error: "Current password is incorrect." };
      patchUser(currentUser.id, { password: next });
      return { ok: true };
    },

    createCategory: (name, description) =>
      setData((d) => ({
        ...d,
        categories: [...d.categories, { id: uid("cat"), name, description, createdAt: nowIso() }],
      })),
    updateCategory: (id, patch) =>
      setData((d) => ({
        ...d,
        categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    deleteCategory: (id) => {
      if (data.courses.some((c) => c.categoryId === id))
        return { ok: false, error: "This category is used by one or more courses." };
      setData((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }));
      return { ok: true };
    },

    createCourse: (input) => {
      const course: Course = {
        ...input,
        id: uid("course"),
        slug: slugify(input.title),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setData((d) => ({ ...d, courses: [course, ...d.courses] }));
      return course;
    },
    updateCourse: (id, patch) =>
      setData((d) => ({
        ...d,
        courses: d.courses.map((c) =>
          c.id === id
            ? { ...c, ...patch, slug: patch.title ? slugify(patch.title) : c.slug, updatedAt: nowIso() }
            : c,
        ),
      })),
    deleteCourse: (id) =>
      setData((d) => {
        const sectionIds = d.sections.filter((s) => s.courseId === id).map((s) => s.id);
        return {
          ...d,
          courses: d.courses.filter((c) => c.id !== id),
          sections: d.sections.filter((s) => s.courseId !== id),
          lessons: d.lessons.filter((l) => !sectionIds.includes(l.sectionId)),
          enrollments: d.enrollments.filter((e) => e.courseId !== id),
          progress: d.progress.filter((p) => p.courseId !== id),
        };
      }),
    toggleCourseStatus: (id) =>
      setData((d) => ({
        ...d,
        courses: d.courses.map((c) =>
          c.id === id
            ? { ...c, status: c.status === "published" ? "draft" : "published", updatedAt: nowIso() }
            : c,
        ),
      })),

    createSection: (courseId, title) =>
      setData((d) => {
        const order = d.sections.filter((s) => s.courseId === courseId).length;
        return { ...d, sections: [...d.sections, { id: uid("sec"), courseId, title, order }] };
      }),
    updateSection: (id, title) =>
      setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, title } : s)) })),
    deleteSection: (id) =>
      setData((d) => ({
        ...d,
        sections: d.sections.filter((s) => s.id !== id),
        lessons: d.lessons.filter((l) => l.sectionId !== id),
      })),
    moveSection: (id, dir) =>
      setData((d) => {
        const target = d.sections.find((s) => s.id === id);
        if (!target) return d;
        const siblings = d.sections
          .filter((s) => s.courseId === target.courseId)
          .sort((a, b) => a.order - b.order);
        const idx = siblings.findIndex((s) => s.id === id);
        const swap = siblings[idx + dir];
        if (!swap) return d;
        return {
          ...d,
          sections: d.sections.map((s) =>
            s.id === target.id ? { ...s, order: swap.order } : s.id === swap.id ? { ...s, order: target.order } : s,
          ),
        };
      }),

    createLesson: (sectionId, input) => {
      const videoId = extractYoutubeId(input.youtubeUrl);
      if (!videoId) return { ok: false, error: "That doesn't look like a valid YouTube URL." };
      setData((d) => {
        const order = d.lessons.filter((l) => l.sectionId === sectionId).length;
        const lesson: Lesson = {
          id: uid("les"),
          sectionId,
          title: input.title,
          description: input.description,
          youtubeUrl: input.youtubeUrl,
          youtubeVideoId: videoId,
          duration: input.duration,
          order,
          freePreview: input.freePreview,
          published: input.published,
        };
        return { ...d, lessons: [...d.lessons, lesson] };
      });
      return { ok: true };
    },
    updateLesson: (id, patch) => {
      let videoId: string | undefined;
      if (patch.youtubeUrl !== undefined) {
        const parsed = extractYoutubeId(patch.youtubeUrl);
        if (!parsed) return { ok: false, error: "That doesn't look like a valid YouTube URL." };
        videoId = parsed;
      }
      setData((d) => ({
        ...d,
        lessons: d.lessons.map((l) =>
          l.id === id ? { ...l, ...patch, ...(videoId ? { youtubeVideoId: videoId } : {}) } : l,
        ),
      }));
      return { ok: true };
    },
    deleteLesson: (id) =>
      setData((d) => ({
        ...d,
        lessons: d.lessons.filter((l) => l.id !== id),
        progress: d.progress.filter((p) => p.lessonId !== id),
      })),
    moveLesson: (id, dir) =>
      setData((d) => {
        const target = d.lessons.find((l) => l.id === id);
        if (!target) return d;
        const siblings = d.lessons
          .filter((l) => l.sectionId === target.sectionId)
          .sort((a, b) => a.order - b.order);
        const idx = siblings.findIndex((l) => l.id === id);
        const swap = siblings[idx + dir];
        if (!swap) return d;
        return {
          ...d,
          lessons: d.lessons.map((l) =>
            l.id === target.id ? { ...l, order: swap.order } : l.id === swap.id ? { ...l, order: target.order } : l,
          ),
        };
      }),

    enroll: (courseId) => {
      if (!currentUserId) return;
      setData((d) => {
        if (d.enrollments.some((e) => e.courseId === courseId && e.studentId === currentUserId)) return d;
        const enrollment: Enrollment = {
          id: uid("enr"),
          studentId: currentUserId,
          courseId,
          status: "in_progress",
          enrolledAt: nowIso(),
          completedAt: null,
          lastLessonId: null,
          lastAccessedAt: nowIso(),
        };
        return { ...d, enrollments: [...d.enrollments, enrollment] };
      });
    },
    setLastLesson: (courseId, lessonId) => {
      if (!currentUserId) return;
      setData((d) => ({
        ...d,
        enrollments: d.enrollments.map((e) =>
          e.courseId === courseId && e.studentId === currentUserId
            ? { ...e, lastLessonId: lessonId, lastAccessedAt: nowIso() }
            : e,
        ),
      }));
    },
    setLessonCompleted: (courseId, lessonId, completed) => {
      if (!currentUserId) return;
      setData((d) => {
        const others = d.progress.filter(
          (p) => !(p.studentId === currentUserId && p.lessonId === lessonId),
        );
        const progress = completed
          ? [
              ...others,
              {
                id: uid("prog"),
                studentId: currentUserId,
                courseId,
                lessonId,
                completed: true,
                completedAt: nowIso(),
              },
            ]
          : others;

        const sectionIds = d.sections.filter((s) => s.courseId === courseId).map((s) => s.id);
        const total = d.lessons.filter((l) => sectionIds.includes(l.sectionId) && l.published).length;
        const done = progress.filter(
          (p) => p.studentId === currentUserId && p.courseId === courseId && p.completed,
        ).length;
        const isComplete = total > 0 && done >= total;

        return {
          ...d,
          progress,
          enrollments: d.enrollments.map((e) =>
            e.courseId === courseId && e.studentId === currentUserId
              ? {
                  ...e,
                  status: isComplete ? "completed" : "in_progress",
                  completedAt: isComplete ? (e.completedAt ?? nowIso()) : null,
                  lastLessonId: lessonId,
                  lastAccessedAt: nowIso(),
                }
              : e,
          ),
        };
      });
    },
    setStudentActive: (studentId, active) => patchUser(studentId, { active }),
  };

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
}

export function useLms() {
  const ctx = useContext(LmsContext);
  if (!ctx) throw new Error("useLms must be used inside <LmsProvider>");
  return ctx;
}

/* ---------------- selectors ---------------- */

export function useSelectors() {
  const { data } = useLms();

  return useMemo(() => {
    const sectionsOf = (courseId: string): Section[] =>
      data.sections.filter((s) => s.courseId === courseId).sort((a, b) => a.order - b.order);

    const lessonsOfSection = (sectionId: string): Lesson[] =>
      data.lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);

    const lessonsOfCourse = (courseId: string): Lesson[] =>
      sectionsOf(courseId).flatMap((s) => lessonsOfSection(s.id));

    const publishedLessonsOfCourse = (courseId: string) =>
      lessonsOfCourse(courseId).filter((l) => l.published);

    const categoryName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? "Uncategorised";

    const enrollmentOf = (studentId: string, courseId: string) =>
      data.enrollments.find((e) => e.studentId === studentId && e.courseId === courseId) ?? null;

    const completedLessonIds = (studentId: string, courseId: string) =>
      new Set(
        data.progress
          .filter((p) => p.studentId === studentId && p.courseId === courseId && p.completed)
          .map((p) => p.lessonId),
      );

    const courseProgress = (studentId: string, courseId: string) => {
      const total = publishedLessonsOfCourse(courseId).length;
      const done = completedLessonIds(studentId, courseId).size;
      return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
    };

    const studentsList = () => data.users.filter((u) => u.role === "student");

    return {
      sectionsOf,
      lessonsOfSection,
      lessonsOfCourse,
      publishedLessonsOfCourse,
      categoryName,
      enrollmentOf,
      completedLessonIds,
      courseProgress,
      studentsList,
    };
  }, [data]);
}
