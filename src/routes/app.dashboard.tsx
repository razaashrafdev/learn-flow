import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Compass, PlayCircle, TrendingUp } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CardGridSkeleton, EmptyState, ProgressRow, StatCard } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Lumen LMS" },
      { name: "description", content: "Track your enrolled courses, progress and continue learning." },
      { property: "og:title", content: "Your dashboard — Lumen LMS" },
      { property: "og:description", content: "Track your progress and continue learning on Lumen." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { data, currentUser, ready } = useLms();
  const s = useSelectors();
  const user = currentUser!;

  const enrollments = data.enrollments.filter((e) => e.studentId === user.id);
  const completed = enrollments.filter((e) => e.status === "completed");
  const inProgress = enrollments.filter((e) => e.status === "in_progress");
  const overall = enrollments.length
    ? Math.round(
        enrollments.reduce((acc, e) => acc + s.courseProgress(user.id, e.courseId).percent, 0) /
          enrollments.length,
      )
    : 0;

  const continueList = inProgress
    .slice()
    .sort((a, b) => (b.lastAccessedAt ?? "").localeCompare(a.lastAccessedAt ?? ""))
    .slice(0, 3);

  return (
    <AppShell
      nav={studentNav}
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      subtitle="Here's where you left off."
      actions={
        <Button asChild>
          <Link to="/app/courses">Browse courses</Link>
        </Button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled courses" value={enrollments.length} icon={BookOpen} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="In progress" value={inProgress.length} icon={PlayCircle} />
        <StatCard label="Overall progress" value={`${overall}%`} icon={TrendingUp} />
      </div>

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Continue learning</h2>
          <Link to="/app/my-courses" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>

        {!ready ? (
          <CardGridSkeleton count={3} />
        ) : continueList.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="You haven't started a course yet"
            description="Browse the catalogue and enroll in something that looks useful."
            action={{ label: "Browse courses", to: "/app/courses" }}
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {continueList.map((e) => {
              const course = data.courses.find((c) => c.id === e.courseId);
              if (!course) return null;
              const progress = s.courseProgress(user.id, course.id);
              const lessons = s.publishedLessonsOfCourse(course.id);
              const done = s.completedLessonIds(user.id, course.id);
              const current = lessons.find((l) => !done.has(l.id)) ?? lessons[0];
              return (
                <article key={e.id} className="card-surface flex flex-col overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-bold">{course.title}</h3>
                    <div className="mt-4">
                      <ProgressRow percent={progress.percent} />
                    </div>
                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                      Next: {current?.title ?? "All lessons complete"}
                    </p>
                    <Button asChild className="mt-5 w-full">
                      <Link to="/app/learn/$courseId" params={{ courseId: course.id }}>
                        Continue learning
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
