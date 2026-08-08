import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, FileQuestion, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { EmptyState, ProgressRow } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";
import { youtubeEmbed } from "@/lib/lms/youtube";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/learn/$courseId")({
  head: () => ({
    meta: [
      { title: "Learning — Lumen LMS" },
      { name: "description", content: "Watch Your Video Lessons and Mark Them Complete as You Go." },
      { property: "og:title", content: "Learning — Lumen LMS" },
      { property: "og:description", content: "Watch Lessons and Track Completion on Lumen LMS." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { courseId } = useParams({ from: "/app/learn/$courseId" });
  const { data, currentUser, setLessonCompleted, setLastLesson } = useLms();
  const s = useSelectors();
  const user = currentUser!;

  const course = data.courses.find((c) => c.id === courseId);
  const enrollment = course ? s.enrollmentOf(user.id, course.id) : null;
  const sections = course ? s.sectionsOf(course.id) : [];
  const lessons = useMemo(
    () => (course ? s.publishedLessonsOfCourse(course.id) : []),
    [course, s],
  );
  const done = course ? s.completedLessonIds(user.id, course.id) : new Set<string>();

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (activeId || lessons.length === 0) return;
    const last = enrollment?.lastLessonId;
    const resume = lessons.find((l) => l.id === last) ?? lessons.find((l) => !done.has(l.id)) ?? lessons[0]!;
    setActiveId(resume.id);
  }, [activeId, lessons, enrollment, done]);

  useEffect(() => {
    if (activeId && course) setLastLesson(course.id, activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  if (!course || !enrollment) {
    return (
        <AppShell nav={studentNav} title="Not Available">
        <EmptyState
          icon={FileQuestion}
          title={course ? "You're Not Enrolled in This Course" : "Course Not Found"}
          description={
            course
              ? "Enroll from the Course Page to Start Watching the Lessons."
              : "This Course May Have Been Removed by the Administrator."
          }
          action={{ label: "Back to Catalogue", to: "/app/courses" }}
        />
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
      toast.success(willFinish ? "Course Completed — Nice Work!" : "Lesson Marked as Complete");
      if (next) setActiveId(next.id);
    } else {
      toast.info("Lesson Marked as Not Complete");
    }
  };

  return (
    <AppShell nav={studentNav} title={course.title} subtitle={`${progress.done}/${progress.total} Lessons Complete`}>
      <Link
        to="/app/courses/$courseId"
        params={{ courseId: course.id }}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Course Overview
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="card-surface overflow-hidden">
            <div className="aspect-video w-full bg-foreground/90">
              {active ? (
                <iframe
                  key={active.id}
                  src={youtubeEmbed(active.youtubeVideoId)}
                  title={active.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold sm:text-xl">{active?.title ?? "No Lessons Yet"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {active?.description ?? "The Administrator Hasn't Added Any Lessons to This Course."}
              </p>

              <div className="mt-6 flex flex-row items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!prev}
                  onClick={() => prev && setActiveId(prev.id)}
                  className="sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
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
                  <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
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
                                <span className="block truncate text-sm font-medium">{lesson.title}</span>
                                <span className="block text-xs text-muted-foreground">{lesson.duration}</span>
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
