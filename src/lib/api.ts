import type {
  Category,
  Course,
  Enrollment,
  EnrollmentState,
  Lesson,
  Resource,
  Section,
  User,
} from "./lms/types";

const API_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.["VITE_API_URL"] ??
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : "http://localhost:5000");

const TOKEN_KEY = "lms.token.v1";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export type AuthResult = { ok: true; token: string; user: User } | { ok: false; error: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? "Request failed");
  return body as T;
}

export async function apiLogin(email: string, password: string): Promise<AuthResult> {
  try {
    const body = await request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(body.token);
    return { ok: true, token: body.token, user: body.user };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unable to sign in" };
  }
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
  whatsapp?: string,
  courseId?: string,
  imageUrl?: string,
): Promise<AuthResult> {
  try {
    const body = await request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, whatsapp, courseId, imageUrl }),
    });
    setToken(body.token);
    return { ok: true, token: body.token, user: body.user };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not create the account" };
  }
}

export async function apiMe(): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  if (!getToken()) return { ok: false, error: "No session" };
  try {
    const body = await request<{ user: User }>("/api/auth/me");
    return { ok: true, user: body.user };
  } catch (e) {
    setToken(null);
    return { ok: false, error: e instanceof Error ? e.message : "Session expired" };
  }
}

export function apiLogout() {
  setToken(null);
  void fetch(`${API_URL}/api/auth/logout`, { method: "POST" }).catch(() => {});
}

export async function apiUploadImage(dataUrl: string): Promise<string> {
  const res = await request<{ url: string }>("/api/upload", {
    method: "POST",
    body: JSON.stringify({ data: dataUrl, folder: "lms" }),
  });
  return res.url;
}

export type Catalog = {
  categories: Category[];
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  resources: Resource[];
};

export async function apiFetchCatalog(): Promise<Catalog | null> {
  try {
    return await request<Catalog>("/api/courses");
  } catch {
    return null;
  }
}

export async function apiFetchResources(): Promise<Resource[]> {
  try {
    const res = await request<{ resources: Resource[] }>("/api/resources");
    return res.resources;
  } catch {
    return [];
  }
}

export type CourseDetail = {
  course: Course & { reviews: Course["reviews"] };
  sections: Section[];
  lessons: Lesson[];
};

export async function apiFetchCourseBySlug(slug: string): Promise<CourseDetail | null> {
  try {
    return await request<CourseDetail>(`/api/courses/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function apiCreateCourse(input: Record<string, unknown>): Promise<Course> {
  return request<Course>("/api/courses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiUpdateCourse(id: string, input: Record<string, unknown>): Promise<Course> {
  return request<Course>(`/api/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function apiDeleteCourse(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/courses/${id}`, { method: "DELETE" });
}

export async function apiSetCourseStatus(
  id: string,
  status: "published" | "draft",
): Promise<Course> {
  return request<Course>(`/api/courses/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function apiCreateSection(courseId: string, title: string): Promise<Section> {
  return request<Section>(`/api/courses/${courseId}/sections`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function apiUpdateSection(id: string, title: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export async function apiDeleteSection(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/sections/${id}`, { method: "DELETE" });
}

export async function apiMoveSection(id: string, dir: -1 | 1): Promise<Section[] | null> {
  try {
    const res = await request<{ sections: Section[] }>(`/api/sections/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ dir }),
    });
    return res.sections;
  } catch {
    return null;
  }
}

export type CreateLessonInput = {
  title: string;
  description?: string;
  youtubeUrl: string;
  duration?: string;
  freePreview?: boolean;
  published?: boolean;
};

export async function apiCreateLesson(
  sectionId: string,
  input: CreateLessonInput,
): Promise<{ ok: true; lesson: Lesson } | { ok: false; error: string }> {
  try {
    const lesson = await request<Lesson>(`/api/sections/${sectionId}/lessons`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { ok: true, lesson };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not add the lesson" };
  }
}

export async function apiUpdateLesson(id: string, input: Record<string, unknown>): Promise<Lesson> {
  return request<Lesson>(`/api/lessons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function apiDeleteLesson(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/lessons/${id}`, { method: "DELETE" });
}

export async function apiMoveLesson(id: string, dir: -1 | 1): Promise<Lesson[] | null> {
  try {
    const res = await request<{ lessons: Lesson[] }>(`/api/lessons/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ dir }),
    });
    return res.lessons;
  } catch {
    return null;
  }
}

export type CreateResourceInput = {
  title: string;
  description: string;
  type: string;
  image: string;
  downloadUrl: string;
  fileSize?: string;
};

export async function apiCreateResource(input: CreateResourceInput): Promise<Resource> {
  return request<Resource>("/api/resources", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiUpdateResource(
  id: string,
  input: Partial<CreateResourceInput>,
): Promise<Resource> {
  return request<Resource>(`/api/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function apiDeleteResource(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/resources/${id}`, { method: "DELETE" });
}

// ---- Students (admin) ----

export type CreateStudentInput = {
  name: string;
  email: string;
  password: string;
  whatsapp?: string;
};

export type UpdateStudentInput = Partial<Pick<User, "name" | "email" | "whatsapp" | "active">>;

export async function apiListStudents(): Promise<User[]> {
  const res = await request<{ students: User[] }>("/api/students");
  return res.students;
}

export async function apiCreateStudent(
  input: CreateStudentInput,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const user = await request<User>("/api/students", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not add the student" };
  }
}

export async function apiUpdateStudent(id: string, input: UpdateStudentInput): Promise<User> {
  return request<User>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function apiChangeStudentPassword(id: string, password: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/students/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
}

export async function apiDeleteStudent(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/students/${id}`, { method: "DELETE" });
}

// ---- Settings (signed-in user) ----

export async function apiUpdateProfile(patch: {
  name: string;
  email: string;
  whatsapp?: string;
  avatar?: string;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const body = await request<{ user: User }>("/api/settings/profile", {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    return { ok: true, user: body.user };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not update the profile" };
  }
}

export async function apiChangePassword(
  current: string,
  next: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await request<{ ok: boolean }>("/api/settings/password", {
      method: "PATCH",
      body: JSON.stringify({ current, next }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not change the password" };
  }
}

// ---- Enrollments (access workflow) ----

/** Raw shape returned by the backend (maps to frontend `Enrollment`). */
export type ApiEnrollment = {
  id: string;
  studentId: string;
  courseId: string;
  accessStatus: EnrollmentState;
  enrolledAt: string;
  updatedAt: string;
};

function toEnrollment(e: ApiEnrollment): Enrollment {
  return {
    id: e.id,
    studentId: e.studentId,
    courseId: e.courseId,
    status: "in_progress",
    accessStatus: e.accessStatus,
    enrolledAt: e.enrolledAt,
  };
}

export async function apiListEnrollments(): Promise<Enrollment[]> {
  const res = await request<{ enrollments: ApiEnrollment[] }>("/api/enrollments");
  return res.enrollments.map(toEnrollment);
}

export type ApiEnrollResult = { ok: true; enrollment: Enrollment } | { ok: false; error: string };

export async function apiEnroll(courseId: string): Promise<ApiEnrollResult> {
  try {
    const body = await request<ApiEnrollment>("/api/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
    return { ok: true, enrollment: toEnrollment(body) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not enroll" };
  }
}

export async function apiSetEnrollmentStatus(
  id: string,
  status: EnrollmentState,
): Promise<Enrollment> {
  const body = await request<ApiEnrollment>(`/api/enrollments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return toEnrollment(body);
}

export async function apiDeleteEnrollment(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/enrollments/${id}`, { method: "DELETE" });
}

export type AccessCheckResult = { access: boolean; status: EnrollmentState | "none" };

export async function apiCheckEnrollmentAccess(courseId: string): Promise<AccessCheckResult> {
  return request<AccessCheckResult>(`/api/enrollments/access/${courseId}`);
}

export async function apiGetPopupImage(): Promise<string | null> {
  try {
    const res = await request<{ imageUrl: string | null }>("/api/settings/popup");
    return res.imageUrl;
  } catch {
    return null;
  }
}

export async function apiSetPopupImage(imageUrl: string): Promise<void> {
  await request<{ ok: boolean }>("/api/settings/popup", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
  });
}

export async function apiRemovePopupImage(): Promise<void> {
  await request<{ ok: boolean }>("/api/settings/popup", { method: "DELETE" });
}
