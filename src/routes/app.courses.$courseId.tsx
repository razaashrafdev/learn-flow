import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  FileQuestion,
  PlayCircle,
  Tag,
  UserRound,
  BookOpen,
  Star,
  Users,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { EmptyState, ProgressRow } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLms, useSelectors } from "@/lib/lms/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Course Details — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Review the Curriculum, Instructor and Lessons Before You Enroll.",
      },
      { property: "og:title", content: "Course Details — Hamza Visuals LMS" },
      { property: "og:description", content: "Review the Curriculum Before You Enroll." },
    ],
  }),
  component: CourseDetails,
});

function CourseDetails() {
  const { courseId } = useParams({ from: "/app/courses/$courseId" });
  const { data, currentUser, enroll, requestEnrollment } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const user = currentUser!;

  const course = data.courses.find((c) => c.id === courseId);

  if (!course || course.status !== "published") {
    return (
      <AppShell nav={studentNav} title="Course Unavailable">
        <EmptyState
          icon={FileQuestion}
          title="This Course Isn't Available"
          description="It May Have Been Unpublished or Removed by the Administrator."
          action={{ label: "Back to Home", to: "/" }}
        />
      </AppShell>
    );
  }

  const sections = s.sectionsOf(course.id);
  const lessons = s.publishedLessonsOfCourse(course.id);
  const enrollment = s.enrollmentOf(user.id, course.id);
  const enrollmentRequest = s.enrollmentRequestOf(user.id, course.id);
  const progress = s.courseProgress(user.id, course.id);
  const done = s.completedLessonIds(user.id, course.id);

  const isPaid = course.pricingType === "paid";
  const isPending = enrollmentRequest?.status === "pending";
  const isApproved = enrollmentRequest?.status === "approved";
  const hasAccess = enrollment || (isPaid && isApproved);

  const handleEnroll = () => {
    if (isPaid) {
      requestEnrollment(course.id);
      toast.success("Enrollment Request Sent — Pending Approval");
    } else {
      enroll(course.id);
      toast.success("You're Enrolled — Happy Learning");
      navigate({ to: "/app/learn/$courseId", params: { courseId: course.id } });
    }
  };

  const getEnrollButtonLabel = () => {
    if (hasAccess) {
      return enrollment
        ? progress.done === 0
          ? "Start Learning"
          : "Continue Learning"
        : "Access Course";
    }
    if (isPaid && isPending) return "Pending Approval";
    if (isPaid) return "Request Enrollment";
    return "Enroll Now";
  };

  return (
    <AppShell nav={studentNav} title={course.title}>
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left: Thumbnail + Course Info */}
        <div className="min-w-0 space-y-6">
          {/* Course Thumbnail & Info Row */}
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-72 lg:w-80 shrink-0 overflow-hidden rounded-xl bg-muted aspect-video sm:aspect-[4/3]">
              <img
                src={course.thumbnail}
                alt={`${course.title} cover`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span
                className={cn(
                  "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold",
                  course.pricingType === "free"
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground",
                )}
              >
                {course.pricingType === "free" ? "FREE" : "PAID"}
              </span>
            </div>

            {/* Course Title & Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{course.title}</h1>

              {/* Rating & Enrollment */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold text-foreground">4.8</span>
                  <span>(2.4k reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> 12.5k students
                </span>
              </div>

              {/* Meta Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> 30 days access
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> {course.level}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <PlayCircle className="h-3.5 w-3.5" /> {lessons.length} lessons
                </span>
              </div>

              {/* Instructor */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">By</span>
                <span className="font-semibold text-foreground">{course.instructor}</span>
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="px-6">
                  <a href="#curriculum">View Curriculum</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Course Preview / Video Area */}
          <div className="card-surface overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <img
                src={course.thumbnail}
                alt={`${course.title} preview`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition-transform hover:scale-110">
                  <PlayCircle className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="card-surface p-6">
            <h3 className="text-lg font-bold">About This Course</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {course.description}
            </p>
          </div>

          {/* Compact Metadata Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Clock, label: "Duration", value: course.duration },
              { icon: PlayCircle, label: "Lessons", value: `${lessons.length} lessons` },
              { icon: Tag, label: "Level", value: course.level },
              { icon: BookOpen, label: "Sections", value: `${sections.length} sections` },
            ].map((item) => (
              <div key={item.label} className="card-surface p-4 text-center">
                <item.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* What You'll Learn */}
          <div className="card-surface p-6">
            <h3 className="text-lg font-bold">What You'll Learn</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Master the fundamentals and advanced concepts",
                "Build real-world projects from scratch",
                "Learn industry best practices and patterns",
                "Gain practical, job-ready skills",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Curriculum */}
          <div id="curriculum" className="card-surface p-6">
            <h3 className="text-lg font-bold">Course Curriculum</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {sections.length} sections · {lessons.length} lessons
            </p>

            {sections.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No Lessons Added Yet.</p>
            ) : (
              <Accordion type="multiple" defaultValue={[sections[0]!.id]} className="mt-4">
                {sections.map((section, si) => {
                  const items = s.lessonsOfSection(section.id).filter((l) => l.published);
                  return (
                    <AccordionItem key={section.id} value={section.id} className="border-border">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">
                            Section {si + 1}: {section.title}
                          </span>
                          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                            {items.length} lessons
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {items.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                            >
                              {done.has(lesson.id) ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                              {lesson.freePreview && !hasAccess ? (
                                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                  Preview
                                </span>
                              ) : null}
                              <span className="shrink-0 text-xs text-muted-foreground">
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
          </div>
        </div>

        {/* Right: Sticky Enrollment Card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface overflow-hidden">
            {/* Price Header */}
            <div className="bg-primary/5 border-b border-border p-6">
              <div className="flex items-baseline gap-2">
                {course.pricingType === "free" ? (
                  <span className="text-3xl font-extrabold text-success">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold text-primary">Rs. {course.price}</span>
                    {course.originalPrice ? (
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {course.originalPrice}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {course.pricingType === "free"
                  ? "Start learning for free today"
                  : "30-day money-back guarantee"}
              </p>
            </div>

            <div className="p-6">
              {hasAccess ? (
                <>
                  <p className="text-sm font-semibold">Your Progress</p>
                  <div className="mt-3">
                    <ProgressRow percent={progress.percent} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {progress.done} of {progress.total} Lessons Completed
                  </p>
                  <Button asChild className="mt-5 w-full" size="lg">
                    <Link to="/app/learn/$courseId" params={{ courseId: course.id }}>
                      {getEnrollButtonLabel()}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={lessons.length === 0 || (isPaid && isPending)}
                    variant={isPaid && isPending ? "secondary" : "default"}
                  >
                    {getEnrollButtonLabel()}
                  </Button>
                  {isPaid && isPending && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Your request is pending admin approval
                    </p>
                  )}
                  {lessons.length === 0 && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      No lessons available yet
                    </p>
                  )}
                </>
              )}

              {/* Course Info */}
              <dl className="mt-6 space-y-4 border-t border-border pt-6">
                {(
                  [
                    [Clock, "Duration", course.duration],
                    [PlayCircle, "Lessons", `${lessons.length} lessons`],
                    [Tag, "Level", course.level],
                    [UserRound, "Instructor", course.instructor],
                    [BookOpen, "Sections", `${sections.length} sections`],
                  ] as const
                ).map(([Icon, label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 text-sm">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" /> {label}
                    </dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
