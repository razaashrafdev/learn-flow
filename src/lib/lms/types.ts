export type Role = "admin" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  whatsapp?: string;
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
export type PricingType = "free" | "paid";

export type CourseReview = {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  date: string;
};

export type InstructorProfile = {
  role: string;
  bio: string;
  avatar?: string;
  rating: number;
  students: number;
  courses: number;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  level: CourseLevel;
  pricingType: PricingType;
  duration: string;
  instructor: string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;

  /** Optional marketing/enrichment fields. Filled for demo/seed courses and
   *  absent for admin-created courses — every consumer must fall back
   *  gracefully when they are missing. */
  language?: string;
  mode?: string;
  accessPeriod?: string;
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  price?: number;
  originalPrice?: number;
  learningOutcomes?: string[];
  requirements?: string[];
  reviews?: CourseReview[];
  instructorProfile?: InstructorProfile;
  videoPreview?: string;
};

export type EnrollmentRequestStatus = "pending" | "approved" | "rejected";

export type EnrollmentRequest = {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentRequestStatus;
  requestedAt: string;
  resolvedAt?: string | null;
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
  enrollmentRequests: EnrollmentRequest[];
  progress: LessonProgress[];
};
