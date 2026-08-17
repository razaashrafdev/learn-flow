import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  FileQuestion,
  Link2,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { EmptyState, ProgressRow } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiCheckEnrollmentAccess, type AccessCheckResult } from "@/lib/api";
import { useLms, useSelectors } from "@/lib/lms/store";
import { youtubeEmbed } from "@/lib/lms/youtube";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/learn/$slug")({
  head: () => ({
    meta: [
      { title: "Learning — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Watch your video lessons and mark them complete as you go.",
      },
      { property: "og:title", content: "Learning — Hamza Visuals LMS" },
      {
        property: "og:description",
        content: "Watch lessons and track completion on Hamza Visuals LMS.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { slug } = useParams({ from: "/app/learn/$slug" });
  const { data, currentUser, setLessonCompleted, setLastLesson, syncEnrollments, syncCatalog } =
    useLms();
  const s = useSelectors();
  const user = currentUser!;
  const navigate = useNavigate();

  const course = data.courses.find((c) => c.slug === slug);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [accessCheck, setAccessCheck] = useState<AccessCheckResult | null>(null);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    setAccessCheck(null);
    (async () => {
      try {
        const res = await apiCheckEnrollmentAccess(course.id);
        if (cancelled) return;
        if (res.access) {
          await syncEnrollments();
          await syncCatalog();
        }
        if (cancelled) return;
        setAccessCheck(res);
      } catch {
        if (!cancelled) setAccessCheck({ access: false, status: "none" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [course?.id, syncEnrollments, syncCatalog]);

  const enrollment = course ? s.enrollmentOf(user.id, course.id) : null;
  const sections = course ? s.sectionsOf(course.id) : [];
  const lessons = useMemo(() => (course ? s.publishedLessonsOfCourse(course.id) : []), [course, s]);
  const done = course ? s.completedLessonIds(user.id, course.id) : new Set<string>();

  useEffect(() => {
    if (activeId || lessons.length === 0) return;
    const last = enrollment?.lastLessonId;
    const resume =
      lessons.find((l) => l.id === last) ?? lessons.find((l) => !done.has(l.id)) ?? lessons[0]!;
    setActiveId(resume.id);
  }, [activeId, lessons, enrollment, done]);

  useEffect(() => {
    if (activeId && course) setLastLesson(course.id, activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  if (!course) {
    return (
      <AppShell nav={studentNav} title="Not Available">
        <EmptyState
          icon={FileQuestion}
          title="Course Not Found"
          description="This course may have been removed by the administrator."
          action={{ label: "Back to Home", to: "/" }}
        />
      </AppShell>
    );
  }

  if (!accessCheck) {
    return (
      <AppShell nav={studentNav} title="Learning">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!accessCheck.access) {
    const status = accessCheck.status;
    const reason =
      status === "pending"
        ? "Your enrollment is waiting for admin approval."
        : status === "rejected"
          ? "Your enrollment request was rejected by the administrator."
          : "You need to enroll in this course to access the content.";
    return (
      <AppShell nav={studentNav} title="Course Locked">
        <AlertDialog
          open
          onOpenChange={(o) => {
            if (!o) void navigate({ to: "/app/my-courses" });
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Course Access Restricted
              </AlertDialogTitle>
              <AlertDialogDescription>{reason}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Link to="/app/my-courses">Go to My Courses</Link>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link to="/app/courses">Browse Courses</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AppShell>
    );
  }

  const active = lessons.find((l) => l.id === activeId) ?? null;
  const index = active ? lessons.findIndex((l) => l.id === active.id) : -1;
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const progress = s.courseProgress(user.id, course.id);
  const isDone = active ? done.has(active.id) : false;

  const toggleComplete = () => {
    if (!active) return;
    setLessonCompleted(course.id, active.id, !isDone);
    if (!isDone) {
      const willFinish = progress.done + 1 >= progress.total;
      toast.success(willFinish ? "Course completed successfully" : "Lesson completed successfully");
      if (next) setActiveId(next.id);
    } else {
      toast.info("Lesson marked as incomplete");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <AppShell
      nav={studentNav}
      title={course.title}
      subtitle={`${progress.done}/${progress.total} Lessons Complete`}
    >
      <Link
        to="/app/my-courses"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="card-surface overflow-hidden">
            <div className="aspect-video w-full bg-foreground/90" onContextMenu={handleContextMenu}>
              {active?.youtubeVideoId ? (
                <iframe
                  key={active.id}
                  src={youtubeEmbed(active.youtubeVideoId)}
                  title={active.title}
                  className="h-full w-full pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              ) : active ? (
                <div className="flex h-full items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
                  <PlayCircle className="h-5 w-5" />
                  Video unavailable — please refresh the page.
                </div>
              ) : null}
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold sm:text-xl">{active?.title ?? "No Lessons Yet"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {active?.description ??
                  "The administrator hasn't added any lessons to this course."}
              </p>

              {active && active.resources && active.resources.length > 0 && (
                <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Link2 className="h-4 w-4 text-primary" />
                    Resources
                  </div>
                  <ul className="mt-3 space-y-2">
                    {active.resources.map((res, idx) => (
                      <li key={idx}>
                        <a
                          href={res}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          {res}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-row items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!prev}
                  onClick={() => prev && setActiveId(prev.id)}
                  className="sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />{" "}
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  onClick={toggleComplete}
                  disabled={!active}
                  variant={isDone ? "secondary" : "default"}
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isDone ? "Completed" : "Mark as Complete"}
                </Button>
                <Button
                  variant="outline"
                  disabled={!next}
                  onClick={() => next && setActiveId(next.id)}
                  className="sm:w-auto"
                >
                  <span className="hidden sm:inline">Next</span>{" "}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="min-w-0">
          <div className="card-surface overflow-hidden lg:sticky lg:top-24">
            <div className="border-b border-border p-5">
              <h3 className="text-base font-bold">Course Content</h3>
              <div className="mt-3">
                <ProgressRow percent={progress.percent} />
              </div>
            </div>
            <div className="max-h-[65vh] overflow-y-auto">
              {sections.map((section, si) => {
                const items = s.lessonsOfSection(section.id).filter((l) => l.published);
                const secDone = items.filter((l) => done.has(l.id)).length;
                return (
                  <div key={section.id}>
                    <div className="bg-surface px-5 py-3">
                      <p className="text-sm font-bold">
                        {si + 1}. {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {secDone}/{items.length} completed
                      </p>
                    </div>
                    <ul>
                      {items.map((lesson) => {
                        const isActive = lesson.id === activeId;
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => setActiveId(lesson.id)}
                              className={cn(
                                "flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left transition-colors",
                                isActive
                                  ? "border-primary bg-primary-soft"
                                  : "border-transparent hover:bg-muted",
                              )}
                            >
                              {done.has(lesson.id) ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                              ) : isActive ? (
                                <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">
                                  {lesson.title}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {lesson.duration}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
