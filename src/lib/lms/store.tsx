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
import { buildSeed, buildEmptyData } from "./seed";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  apiFetchCatalog,
  apiCreateCourse,
  apiUpdateCourse,
  apiDeleteCourse,
  apiSetCourseStatus,
  apiCreateSection,
  apiUpdateSection,
  apiDeleteSection,
  apiMoveSection,
  apiCreateLesson,
  apiUpdateLesson,
  apiDeleteLesson,
  apiMoveLesson,
  apiCreateResource,
  apiUpdateResource,
  apiDeleteResource,
  apiListStudents,
  apiCreateStudent,
  apiUpdateStudent,
  apiChangeStudentPassword,
  apiDeleteStudent,
  apiUpdateProfile,
  apiChangePassword,
  apiListEnrollments,
  apiEnroll,
  apiSetEnrollmentStatus,
  apiDeleteEnrollment,
  type CreateResourceInput,
  type CreateStudentInput,
} from "../api";
import type {
  Category,
  Course,
  CourseReview,
  Enrollment,
  EnrollmentState,
  Lesson,
  LmsData,
  Resource,
  Section,
  User,
} from "./types";

const STORAGE_KEY_BASE = "lms.demo.v7";
const SESSION_KEY = "lms.session.v1";
const dataKey = (userId: string) => `${STORAGE_KEY_BASE}.${userId}`;

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();

/** localStorage key for payment screenshots submitted during registration. */
const paymentScreenshotKey = (studentId: string, courseId: string) =>
  `lms.payment.${studentId}.${courseId}`;

/** Store a payment screenshot URL in localStorage (called after registration). */
export function storePaymentScreenshot(studentId: string, courseId: string, url: string) {
  try {
    localStorage.setItem(paymentScreenshotKey(studentId, courseId), url);
  } catch {
    /* quota */
  }
}

/** Retrieve a payment screenshot URL from localStorage (used by admin view). */
export function getPaymentScreenshot(studentId: string, courseId: string): string | null {
  try {
    return localStorage.getItem(paymentScreenshotKey(studentId, courseId));
  } catch {
    return null;
  }
}

const upsertEnrollment = (list: Enrollment[], next: Enrollment): Enrollment[] => {
  const others = list.filter(
    (e) => !(e.studentId === next.studentId && e.courseId === next.courseId),
  );
  return [...others, next];
};

const readData = (userId: string): LmsData | null => {
  try {
    const raw = localStorage.getItem(dataKey(userId));
    return raw ? (JSON.parse(raw) as LmsData) : null;
  } catch {
    return null;
  }
};

const initialDataFor = (user: User): LmsData =>
  readData(user.id) ?? (user.role === "admin" ? buildSeed() : buildEmptyData());

type Ctx = {
  ready: boolean;
  data: LmsData;
  currentUser: User | null;

  syncCatalog: () => Promise<void>;
  syncStudents: () => Promise<void>;
  syncEnrollments: () => Promise<void>;
  signIn: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    whatsapp?: string,
    courseId?: string,
    imageUrl?: string,
  ) => Promise<{ ok: boolean; error?: string; userId?: string }>;
  signOut: () => void;
  updateProfile: (
    patch: Partial<Pick<User, "name" | "email" | "avatar" | "whatsapp">>,
  ) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;

  createCategory: (name: string, description: string) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => { ok: boolean; error?: string };

  createCourse: (input: Omit<Course, "id" | "slug" | "createdAt" | "updatedAt">) => Promise<Course>;
  updateCourse: (id: string, patch: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseStatus: (id: string) => Promise<void>;

  createSection: (courseId: string, title: string) => Promise<void>;
  updateSection: (id: string, title: string) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  moveSection: (id: string, dir: -1 | 1) => Promise<void>;

  createLesson: (
    sectionId: string,
    input: {
      title: string;
      description: string;
      youtubeUrl: string;
      duration: string;
      freePreview: boolean;
      published: boolean;
    },
  ) => Promise<{ ok: boolean; error?: string }>;
  updateLesson: (
    id: string,
    patch: Partial<Lesson> & { youtubeUrl?: string },
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteLesson: (id: string) => Promise<void>;
  moveLesson: (id: string, dir: -1 | 1) => Promise<void>;

  enroll: (courseId: string) => Promise<boolean>;
  requestEnrollment: (courseId: string, screenshotUrl?: string) => void;
  approveEnrollment: (requestId: string) => void;
  rejectEnrollment: (requestId: string) => void;
  setEnrollmentStatus: (enrollmentId: string, status: EnrollmentState) => Promise<void>;
  deleteEnrollment: (enrollmentId: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  setLessonCompleted: (courseId: string, lessonId: string, completed: boolean) => void;
  setStudentActive: (studentId: string, active: boolean) => Promise<void>;
  createStudent: (
    name: string,
    email: string,
    password: string,
    whatsapp?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateStudent: (
    id: string,
    patch: Partial<Pick<User, "name" | "email" | "whatsapp" | "active">>,
  ) => Promise<{ ok: boolean; error?: string }>;
  changeStudentPassword: (
    id: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteStudent: (id: string) => Promise<void>;

  addReview: (courseId: string, rating: number, content: string) => void;

  addResource: (resource: Omit<Resource, "id">) => Promise<void>;
  updateResource: (id: string, patch: Partial<Omit<Resource, "id">>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
};

const LmsContext = createContext<Ctx | null>(null);

export function LmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LmsData>(() => buildEmptyData());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  const currentUserId = currentUser?.id ?? null;

  const persistSession = (id: string | null, remember = true) => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      if (id) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const syncCatalog = useCallback(async () => {
    const catalog = await apiFetchCatalog();
    if (!catalog) return;
    setData((d) => ({
      ...d,
      categories: catalog.categories.length ? catalog.categories : d.categories,
      courses: catalog.courses,
      sections: catalog.sections,
      lessons: catalog.lessons,
      resources: catalog.resources,
    }));
  }, []);

  const syncStudents = useCallback(async () => {
    try {
      const students = await apiListStudents();
      setData((d) => ({
        ...d,
        users: students.map((s) => ({ ...s, role: "student" })),
      }));
    } catch {
      /* keep existing users on failure */
    }
  }, []);

  const syncEnrollments = useCallback(async () => {
    try {
      const enrollments = await apiListEnrollments();
      setData((d) => {
        const merged = enrollments.map((incoming) => {
          const local = d.enrollments.find((e) => e.id === incoming.id);
          return {
            ...incoming,
            status: (local?.status ?? "in_progress") as "in_progress" | "completed",
            completedAt: local?.completedAt ?? null,
            lastLessonId: local?.lastLessonId ?? null,
            lastAccessedAt: local?.lastAccessedAt ?? null,
          };
        });
        return { ...d, enrollments: merged };
      });
    } catch {
      /* keep existing enrollments on failure */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
        const me = await apiMe();
        if (cancelled) return;
        if (me.ok) {
          setCurrentUser(me.user);
          setData(initialDataFor(me.user));
          await syncCatalog();
          await syncEnrollments();
          if (session !== me.user.id) {
            try {
              localStorage.setItem(SESSION_KEY, me.user.id);
            } catch {
              /* ignore */
            }
          }
        } else {
          await syncCatalog();
          try {
            localStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        hydrated.current = true;
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current || !currentUser) return;
    try {
      localStorage.setItem(dataKey(currentUser.id), JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [data, currentUser]);

  const signIn: Ctx["signIn"] = useCallback(
    async (email, password, remember) => {
      const result = await apiLogin(email, password);
      if (!result.ok) return { ok: false, error: result.error };
      persistSession(result.user.id, remember);
      setCurrentUser(result.user);
      setData(initialDataFor(result.user));
      await syncCatalog();
      await syncEnrollments();
      return { ok: true };
    },
    [syncCatalog, syncEnrollments],
  );

  const register: Ctx["register"] = useCallback(
    async (name, email, password, whatsapp, courseId, imageUrl) => {
      const result = await apiRegister(name, email, password, whatsapp, courseId, imageUrl);
      if (!result.ok) return { ok: false, error: result.error };
      // Do NOT auto-login — user must log in manually from the login page.
      return { ok: true, userId: result.user.id };
    },
    [],
  );

  const signOut = useCallback(() => {
    apiLogout();
    persistSession(null);
    setCurrentUser(null);
    setData(buildEmptyData());
  }, []);

  const patchUser = (id: string, patch: Partial<User>) =>
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));

  const setEnrollmentStatus = async (enrollmentId: string, status: EnrollmentState) => {
    const updated = await apiSetEnrollmentStatus(enrollmentId, status);
    setData((d) => ({
      ...d,
      enrollments: d.enrollments.map((e) => (e.id === enrollmentId ? updated : e)),
    }));
  };

  const value: Ctx = {
    ready,
    data,
    currentUser,
    syncCatalog,
    syncStudents,
    syncEnrollments,
    signIn,
    register,
    signOut,

    updateProfile: async (patch) => {
      if (!currentUser) return { ok: false, error: "Not signed in." };
      const profilePatch: { name: string; email: string; whatsapp?: string; avatar?: string } = {
        name: patch.name ?? currentUser.name,
        email: patch.email ?? currentUser.email,
      };
      if (patch.whatsapp !== undefined) profilePatch.whatsapp = patch.whatsapp;
      if (patch.avatar !== undefined) profilePatch.avatar = patch.avatar;
      const result = await apiUpdateProfile(profilePatch);
      if (!result.ok) return { ok: false, error: result.error };
      if (currentUserId) {
        const userPatch: Partial<User> = {
          name: result.user.name,
          email: result.user.email,
        };
        if (result.user.whatsapp !== undefined) userPatch.whatsapp = result.user.whatsapp;
        if (result.user.avatar !== undefined) userPatch.avatar = result.user.avatar;
        patchUser(currentUserId, userPatch);
        setCurrentUser((u) => (u ? { ...u, ...userPatch } : u));
      }
      return { ok: true };
    },
    changePassword: async (current, next) => {
      if (!currentUser) return { ok: false, error: "Not signed in." };
      return apiChangePassword(current, next);
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

    createCourse: async (input) => {
      const course = await apiCreateCourse(input as Record<string, unknown>);
      setData((d) => ({ ...d, courses: [course, ...d.courses] }));
      return course;
    },
    updateCourse: async (id, patch) => {
      const updated = await apiUpdateCourse(id, patch as Record<string, unknown>);
      setData((d) => ({
        ...d,
        courses: d.courses.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));
    },
    deleteCourse: async (id) => {
      await apiDeleteCourse(id);
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
      });
    },
    toggleCourseStatus: async (id) => {
      const course = data.courses.find((c) => c.id === id);
      if (!course) return;
      const next = course.status === "published" ? "draft" : "published";
      const updated = await apiSetCourseStatus(id, next);
      setData((d) => ({
        ...d,
        courses: d.courses.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));
    },

    createSection: async (courseId, title) => {
      const section = await apiCreateSection(courseId, title);
      setData((d) => ({ ...d, sections: [...d.sections, section] }));
    },
    updateSection: async (id, title) => {
      await apiUpdateSection(id, title);
      setData((d) => ({
        ...d,
        sections: d.sections.map((s) => (s.id === id ? { ...s, title } : s)),
      }));
    },
    deleteSection: async (id) => {
      await apiDeleteSection(id);
      setData((d) => ({
        ...d,
        sections: d.sections.filter((s) => s.id !== id),
        lessons: d.lessons.filter((l) => l.sectionId !== id),
      }));
    },
    moveSection: async (id, dir) => {
      const siblings = await apiMoveSection(id, dir);
      if (!siblings) return;
      setData((d) => ({
        ...d,
        sections: d.sections.map((s) => siblings.find((x) => x.id === s.id) ?? s),
      }));
    },

    createLesson: async (sectionId, input) => {
      const result = await apiCreateLesson(sectionId, input);
      if (!result.ok) return { ok: false, error: result.error };
      setData((d) => ({ ...d, lessons: [...d.lessons, result.lesson] }));
      return { ok: true };
    },
    updateLesson: async (id, patch) => {
      try {
        const updated = await apiUpdateLesson(id, patch as Record<string, unknown>);
        setData((d) => ({
          ...d,
          lessons: d.lessons.map((l) => (l.id === id ? { ...l, ...updated } : l)),
        }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Could not update the lesson" };
      }
    },
    deleteLesson: async (id) => {
      await apiDeleteLesson(id);
      setData((d) => ({
        ...d,
        lessons: d.lessons.filter((l) => l.id !== id),
        progress: d.progress.filter((p) => p.lessonId !== id),
      }));
    },
    moveLesson: async (id, dir) => {
      const siblings = await apiMoveLesson(id, dir);
      if (!siblings) return;
      setData((d) => ({
        ...d,
        lessons: d.lessons.map((l) => siblings.find((x) => x.id === l.id) ?? l),
      }));
    },

    enroll: async (courseId): Promise<boolean> => {
      if (!currentUserId) return false;
      const result = await apiEnroll(courseId);
      if (result.ok) {
        setData((d) => ({ ...d, enrollments: upsertEnrollment(d.enrollments, result.enrollment) }));
        return true;
      }
      return false;
    },
    requestEnrollment: async (courseId, screenshotUrl) => {
      if (!currentUserId) return;
      const result = await apiEnroll(courseId);
      if (result.ok) {
        setData((d) => ({ ...d, enrollments: upsertEnrollment(d.enrollments, result.enrollment) }));
        if (screenshotUrl) {
          storePaymentScreenshot(currentUserId, courseId, screenshotUrl);
        }
      }
    },
    approveEnrollment: (requestId) => {
      void setEnrollmentStatus(requestId, "accepted");
    },
    setEnrollmentStatus,
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
        const total = d.lessons.filter(
          (l) => sectionIds.includes(l.sectionId) && l.published,
        ).length;
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
    setStudentActive: async (studentId, active) => {
      try {
        const updated = await apiUpdateStudent(studentId, { active });
        setData((d) => ({
          ...d,
          users: d.users.map((u) => (u.id === studentId ? { ...u, active: updated.active } : u)),
        }));
      } catch {
        /* ignore — caller handles messaging */
      }
    },
    createStudent: async (name, email, password, whatsapp) => {
      const input: CreateStudentInput = { name, email, password };
      if (whatsapp !== undefined && whatsapp !== "") input.whatsapp = whatsapp;
      const result = await apiCreateStudent(input);
      if (!result.ok) return { ok: false, error: result.error };
      const student: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: "student",
        active: result.user.active,
        createdAt: result.user.createdAt,
      };
      if (result.user.whatsapp !== undefined) student.whatsapp = result.user.whatsapp;
      setData((d) => ({ ...d, users: [...d.users, student] }));
      return { ok: true };
    },
    updateStudent: async (id, patch) => {
      try {
        const updated = await apiUpdateStudent(id, patch);
        setData((d) => ({
          ...d,
          users: d.users.map((u) => {
            if (u.id !== id) return u;
            const merged: User = {
              ...u,
              name: updated.name,
              email: updated.email,
              active: updated.active,
            };
            if (updated.whatsapp !== undefined) merged.whatsapp = updated.whatsapp;
            return merged;
          }),
        }));
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : "Could not update the student.",
        };
      }
    },
    changeStudentPassword: async (id, newPassword) => {
      if (newPassword.length < 8) return { ok: false, error: "Use at least 8 characters." };
      try {
        await apiChangeStudentPassword(id, newPassword);
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : "Could not change the password.",
        };
      }
    },
    deleteStudent: async (id) => {
      try {
        await apiDeleteStudent(id);
      } catch {
        /* ignore */
      }
      setData((d) => ({
        ...d,
        users: d.users.filter((u) => u.id !== id),
        enrollments: d.enrollments.filter((e) => e.studentId !== id),
        progress: d.progress.filter((p) => p.studentId !== id),
      }));
    },

    rejectEnrollment: (requestId) => {
      void setEnrollmentStatus(requestId, "rejected");
    },

    deleteEnrollment: async (enrollmentId) => {
      try {
        await apiDeleteEnrollment(enrollmentId);
      } catch {
        /* ignore */
      }
      setData((d) => ({
        ...d,
        enrollments: d.enrollments.filter((e) => e.id !== enrollmentId),
      }));
    },

    addReview: (courseId, rating, content) => {
      if (!currentUserId) return;
      const user = data.users.find((u) => u.id === currentUserId);
      if (!user) return;
      setData((d) => {
        const course = d.courses.find((c) => c.id === courseId);
        if (!course) return d;
        const review: CourseReview = {
          id: uid("rev"),
          author: user.name,
          role: "Student",
          rating,
          content,
          date: nowIso(),
        };
        const existingReviews = course.reviews ?? [];
        const newReviewCount = (course.reviewCount ?? 0) + 1;
        const oldRatingTotal = (course.rating ?? 0) * (course.reviewCount ?? 0);
        const newRating = (oldRatingTotal + rating) / newReviewCount;
        return {
          ...d,
          courses: d.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  reviews: [...existingReviews, review],
                  reviewCount: newReviewCount,
                  rating: Math.round(newRating * 10) / 10,
                }
              : c,
          ),
        };
      });
    },

    addResource: async (resource) => {
      const created = await apiCreateResource(resource as CreateResourceInput);
      setData((d) => ({ ...d, resources: [...d.resources, created] }));
    },

    updateResource: async (id, patch) => {
      const updated = await apiUpdateResource(id, patch as Partial<CreateResourceInput>);
      setData((d) => ({
        ...d,
        resources: d.resources.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      }));
    },

    deleteResource: async (id) => {
      await apiDeleteResource(id);
      setData((d) => ({
        ...d,
        resources: d.resources.filter((r) => r.id !== id),
      }));
    },
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

    const categoryName = (id: string) =>
      data.categories.find((c) => c.id === id)?.name ?? "Uncategorised";

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

    const enrollmentRequestOf = (studentId: string, courseId: string) =>
      data.enrollmentRequests.find((r) => r.studentId === studentId && r.courseId === courseId) ??
      (() => {
        const enrollment = data.enrollments.find(
          (e) => e.studentId === studentId && e.courseId === courseId,
        );
        if (enrollment?.accessStatus !== "pending") return null;
        return {
          id: enrollment.id,
          studentId,
          courseId,
          status: "pending" as const,
          requestedAt: enrollment.enrolledAt,
          resolvedAt: null,
        };
      })();

    return {
      sectionsOf,
      lessonsOfSection,
      lessonsOfCourse,
      publishedLessonsOfCourse,
      categoryName,
      enrollmentOf,
      enrollmentRequestOf,
      completedLessonIds,
      courseProgress,
      studentsList,
    };
  }, [data]);
}
