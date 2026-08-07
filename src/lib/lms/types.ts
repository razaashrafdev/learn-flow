export type Role = "admin" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  active: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type CourseStatus = "draft" | "published";

export type Course = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  level: CourseLevel;
  duration: string;
  instructor: string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  order: number;
};

export type Lesson = {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  duration: string;
  order: number;
  freePreview: boolean;
  published: boolean;
};

export type EnrollmentStatus = "in_progress" | "completed";

export type Enrollment = {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string | null;
  lastLessonId?: string | null;
  lastAccessedAt?: string | null;
};

export type LessonProgress = {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string | null;
};

export type LmsData = {
  users: User[];
  categories: Category[];
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
};
