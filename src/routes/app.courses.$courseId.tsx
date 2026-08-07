import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, Circle, Clock, FileQuestion, PlayCircle, Signal, UserRound } from "lucide-react";
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

export const Route = createFileRoute("/app/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Course details — Lumen LMS" },
      { name: "description", content: "Review the curriculum, instructor and lessons before you enroll." },
      { property: "og:title", content: "Course details — Lumen LMS" },
      { property: "og:description", content: "Review the curriculum before you enroll." },
    ],
  }),
  component: CourseDetails,
});

function CourseDetails() {
  const { courseId } = useParams({ from: "/app/courses/$courseId" });
  const { data, currentUser, enroll } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const user = currentUser!;

  const course = data.courses.find((c) => c.id === courseId);

  if (!course || course.status !== "published") {
    return (
      <AppShell nav={studentNav} title="Course unavailable">
        <EmptyState
          icon={FileQuestion}
          title="This course isn't available"
          description="It may have been unpublished or removed by the administrator."
          action={{ label: "Back to catalogue", to: "/app/courses" }}
        />
      </AppShell>
    );
  }

  const sections = s.sectionsOf(course.id);
  const lessons = s.publishedLessonsOfCourse(course.id);
  const enrollment = s.enrollmentOf(user.id, course.id);
  const progress = s.courseProgress(user.id, course.id);
  const done = s.completedLessonIds(user.id, course.id);

  const handleEnroll = () => {
    enroll(course.id);
    toast.success("You're enrolled — happy learning");
    navigate({ to: "/app/learn/$courseId", params: { courseId: course.id } });
  };

  return (
    <AppShell nav={studentNav} title={course.title} subtitle={s.categoryName(course.categoryId)}>
      <Link
        to="/app/courses"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to courses
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <div className="card-surface overflow-hidden">
            <div className="aspect-video bg-muted">
              <img src={course.thumbnail} alt={`${course.title} cover`} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{course.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" /> {course.instructor}
                </span>
                <span className="flex items-center gap-2">
                  <Signal className="h-4 w-4" /> {course.level}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
                <span className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> {lessons.length} lessons
                </span>
              </div>
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="text-base font-bold">Course curriculum</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {sections.length} sections · {lessons.length} lessons
            </p>

            {sections.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No lessons added yet.</p>
            ) : (
              <Accordion type="multiple" defaultValue={[sections[0]!.id]} className="mt-4">
                {sections.map((section, si) => {
                  const items = s.lessonsOfSection(section.id).filter((l) => l.published);
                  return (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-left">
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
                              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                            >
                              {done.has(lesson.id) ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                              {lesson.freePreview && !enrollment ? (
                                <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                                  Preview
                                </span>
                              ) : null}
                              <span className="shrink-0 text-xs text-muted-foreground">{lesson.duration}</span>
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

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-6">
            {enrollment ? (
              <>
                <p className="text-sm font-semibold">Your progress</p>
                <div className="mt-3">
                  <ProgressRow percent={progress.percent} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {progress.done} of {progress.total} lessons completed
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link to="/app/learn/$courseId" params={{ courseId: course.id }}>
                    {progress.done === 0 ? "Start learning" : "Continue learning"}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold">Ready to start?</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Enrollment is free and gives you access to every lesson in this course.
                </p>
                <Button className="mt-5 w-full" onClick={handleEnroll} disabled={lessons.length === 0}>
                  Enroll now
                </Button>
                {lessons.length === 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    This course has no lessons yet.
                  </p>
                ) : null}
              </>
            )}

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              {[
                ["Category", s.categoryName(course.categoryId)],
                ["Level", course.level],
                ["Duration", course.duration],
                ["Lessons", String(lessons.length)],
                ["Instructor", course.instructor],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
