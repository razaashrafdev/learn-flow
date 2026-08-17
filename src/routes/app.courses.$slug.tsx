import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  Circle,
  Clock,
  FileQuestion,
  PlayCircle,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useLms, useSelectors } from "@/lib/lms/store";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/lms/types";
import { PaymentEnrollModal } from "@/components/lms/payment-enroll-modal";

export const Route = createFileRoute("/app/courses/$slug")({
  head: () => ({
    meta: [
      { title: "Course Details — Hamza Visuals LMS" },
      { name: "description", content: "Course Details on Hamza Visuals LMS." },
      { property: "og:title", content: "Course Details — Hamza Visuals LMS" },
      { property: "og:description", content: "Course Details on Hamza Visuals LMS." },
    ],
  }),
  component: CourseDetails,
});

function formatCount(n?: number) {
  return n == null ? "" : n.toLocaleString("en-US");
}

function formatTotalDuration(lessons: Lesson[]) {
  const total = lessons.reduce((acc, l) => {
    const m = /(\d+)\s*min/.exec(l.duration);
    return acc + (m ? parseInt(m[1]!, 10) : 0);
  }, 0);
  const h = Math.floor(total / 60);
  const min = total % 60;
  if (h > 0 && min > 0) return `${h}h ${min}m`;
  if (h > 0) return `${h}h`;
  return `${min}m`;
}

function CourseDetails() {
  const { slug } = useParams({ from: "/app/courses/$slug" });
  const { data, currentUser, enroll, requestEnrollment } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const user = currentUser!;
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const course = data.courses.find((c) => c.slug === slug);

  if (!course || course.status !== "published") {
    return (
      <AppShell nav={studentNav} title="Course Unavailable">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-bold">Course Not Found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This course may have been removed or is not published yet.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/app/courses">Browse Courses</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const enrollment = s.enrollmentOf(user.id, course.id);

  const courseSections = s.sectionsOf(course.id);
  const lessonsList = s.publishedLessonsOfCourse(course.id);
  const isPaid = course.pricingType === "paid";
  const rating = course.rating ?? 0;
  const reviewCount = course.reviewCount ?? 0;
  const enrolledCount =
    course.studentCount ?? data.enrollments.filter((e) => e.courseId === course.id).length;
  const reviews = course.reviews ?? [];
  const totalDuration = formatTotalDuration(lessonsList) || course.duration;

  const defaultOpen = courseSections[0];
  const defaultValue = defaultOpen ? [defaultOpen.id] : [];

  const discountPercent =
    isPaid && course.price && course.originalPrice
      ? Math.round((1 - course.price / course.originalPrice) * 100)
      : 0;

  const myEnrollmentRequest = s.enrollmentRequestOf(user.id, course.id);
  const isPending =
    myEnrollmentRequest?.status === "pending" || enrollment?.accessStatus === "pending";
  const hasAccess = !!enrollment && enrollment.accessStatus === "accepted";

  const enrollLabel = hasAccess
    ? "Start Learning"
    : isPaid && isPending
      ? "Pending Approval"
      : "Click Here to Enroll";

  const handleEnroll = async () => {
    if (isPaid && isPending) return;
    if (hasAccess) {
      navigate({ to: "/app/learn/$slug", params: { slug: course.slug } });
      return;
    }
    if (isPaid) {
      setPaymentModalOpen(true);
      return;
    }
    const ok = await enroll(course.id);
    if (ok) {
      toast.success("Enrollment completed successfully");
      navigate({ to: "/app/learn/$slug", params: { slug: course.slug } });
    } else {
      toast.error("Enrollment failed. Please try again");
    }
  };

  const handlePaymentEnroll = async (screenshotUrl: string) => {
    setEnrollLoading(true);
    try {
      requestEnrollment(course.id, screenshotUrl);
      toast.success("Enrollment request sent successfully");
      setPaymentModalOpen(false);
      navigate({ to: "/app/my-courses" });
    } catch {
      toast.error("Enrollment failed. Please try again");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (enrollment) {
    navigate({ to: "/app/learn/$slug", params: { slug: course.slug }, replace: true });
    return null;
  }

  return (
    <AppShell nav={studentNav} title={course.title}>
      <Link
        to="/app/courses"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Courses
      </Link>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-primary dark:bg-[#0C0C0C] lg:col-span-2">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-44 h-[28rem] w-[28rem] rounded-full bg-primary-foreground/10 blur-3xl dark:bg-[rgba(0,118,223,0.32)]" />
            <div className="absolute -bottom-48 -left-28 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl dark:bg-[rgba(0,118,223,0.18)]" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-12%,rgba(255,255,255,0.06),transparent_62%)] dark:bg-[radial-gradient(120%_60%_at_50%_-12%,rgba(0,118,223,0.18),transparent_62%)]" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
                    isPaid
                      ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300"
                      : "border-success/40 bg-success/15 text-success dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
                  )}
                >
                  {isPaid ? "PAID COURSE" : "FREE COURSE"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-primary-foreground dark:text-white sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/70 dark:text-white/70 sm:text-base">
                {course.shortDescription}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-0.5"
                    aria-label={`Rated ${rating.toFixed(1)} out of 5`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(rating)
                            ? "fill-[#FFFFFF] text-[#FFFFFF]"
                            : "fill-transparent text-primary-foreground/25 dark:text-white/25",
                        )}
                      />
                    ))}
                  </span>
                  <span className="font-bold text-primary-foreground dark:text-white">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-primary-foreground/60 dark:text-white/60">
                    ({formatCount(reviewCount)} reviews)
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-primary-foreground/60 dark:text-white/60">
                  <Users className="h-4 w-4" /> {formatCount(enrolledCount)} students
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Left content column ---------- */}
        <div className="mt-6 min-w-0 space-y-6 lg:mt-8">
          {/* Course Curriculum */}
          <section id="curriculum" className="card-surface scroll-mt-24 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Syllabus
              </p>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">Course Curriculum</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {courseSections.length} sections · {lessonsList.length} lessons · {totalDuration}{" "}
              total
            </p>

            {courseSections.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No lessons added yet.</p>
            ) : (
              <Accordion type="multiple" defaultValue={defaultValue} className="mt-6 space-y-3">
                {courseSections.map((section, si) => {
                  const items = s.lessonsOfSection(section.id).filter((l) => l.published);
                  return (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="overflow-hidden rounded-xl border border-border bg-background/50"
                    >
                      <AccordionTrigger className="gap-3 px-4 py-4 hover:no-underline data-[state=open]:border-b data-[state=open]:border-border sm:px-5">
                        <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-accent-foreground">
                            {si + 1}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                              {section.title}
                            </span>
                            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                              {items.length} lessons · {formatTotalDuration(items)}
                            </span>
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="px-4 pb-3 pt-1 sm:px-5">
                          {items.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60"
                            >
                              <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                              <span className="min-w-0 flex-1 truncate text-sm">
                                {lesson.title}
                              </span>
                              {lesson.freePreview ? (
                                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                  Preview
                                </span>
                              ) : null}
                              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </section>

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="card-surface p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Feedback
                </p>
                <h2 className="mt-1 text-lg font-bold sm:text-xl">Student Reviews</h2>
              </div>

              <ul className="mt-6 space-y-4">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start gap-4 rounded-xl border border-border bg-background/50 p-5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-accent-foreground">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{r.author}</p>
                        <span className="inline-flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.round(r.rating)
                                  ? "fill-warning text-warning"
                                  : "fill-transparent text-muted-foreground/30",
                              )}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        &ldquo;{r.content}&rdquo;
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ---------- Right: sticky enrollment card ---------- */}
        <aside className="mt-6 lg:sticky lg:top-24 lg:mt-8 lg:self-start">
          <div className="card-surface overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <img
                src={course.thumbnail}
                alt={`${course.title} cover`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span
                className={cn(
                  "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold",
                  isPaid
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground",
                )}
              >
                {isPaid ? "PAID" : "FREE"}
              </span>
            </div>

            <div className="p-6">
              {isPaid ? (
                <div className="flex flex-wrap items-end gap-2.5">
                  <span className="text-3xl font-extrabold text-primary">Rs. {course.price}</span>
                  {course.originalPrice ? (
                    <>
                      <span className="pb-1 text-sm text-muted-foreground line-through">
                        Rs. {course.originalPrice}
                      </span>
                      <span className="mb-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                        {discountPercent}% OFF
                      </span>
                    </>
                  ) : null}
                </div>
              ) : (
                <span className="text-3xl font-extrabold text-success">Free</span>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {isPaid
                  ? `${course.accessPeriod ?? "Full access"} with 30-day money-back guarantee`
                  : "Start learning for free — no card required"}
              </p>

              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={handleEnroll}
                disabled={isPaid && isPending}
              >
                {enrollLabel}
              </Button>
              <p className="mt-2.5 text-center text-xs text-muted-foreground">
                {hasAccess
                  ? "Continue where you left off"
                  : isPaid && isPending
                    ? "Your request is pending admin approval"
                    : isPaid
                      ? "Your enrollment request will be reviewed by an administrator"
                      : "Enroll free and start learning"}
              </p>

              <dl className="mt-6 space-y-3.5 border-t border-border pt-6">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <PlayCircle className="h-4 w-4" /> Lessons
                  </dt>
                  <dd className="min-w-0 truncate font-semibold">{lessonsList.length} lessons</dd>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" /> Duration
                  </dt>
                  <dd className="min-w-0 truncate font-semibold">{totalDuration}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <UserRound className="h-4 w-4" /> Instructor
                  </dt>
                  <dd className="min-w-0 truncate font-semibold">{course.instructor}</dd>
                </div>
              </dl>

              {isPaid ? (
                <p className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> 30-day money-back
                  guarantee
                </p>
              ) : (
                <p className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                  <BookOpen className="h-4 w-4 shrink-0 text-primary" /> Learn at your own pace with
                  lifetime access
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <PaymentEnrollModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onSubmit={handlePaymentEnroll}
        loading={enrollLoading}
      />
    </AppShell>
  );
}
