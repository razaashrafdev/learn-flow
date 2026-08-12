import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Compass, PlayCircle, TrendingUp } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CardGridSkeleton, EmptyState, ProgressRow, StatCard } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Hamza Visuals LMS" },
      { name: "description", content: "Track Your Enrolled Courses, Progress and Continue Learning." },
      { property: "og:title", content: "Your Dashboard — Hamza Visuals LMS" },
      { property: "og:description", content: "Track Your Progress and Continue Learning on Hamza Visuals." },
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
      subtitle="Here's Where You Left Off."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled Courses" value={enrollments.length} icon={BookOpen} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Overall Progress" value={`${overall}%`} icon={TrendingUp} />
        <div className="hidden sm:block"><StatCard label="In Progress" value={inProgress.length} icon={PlayCircle} /></div>
      </div>

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Continue Learning</h2>
          <Link to="/app/my-courses" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>

        {!ready ? (
          <CardGridSkeleton count={3} />
        ) : continueList.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="You Haven't Started a Course Yet"
            description="Browse the Catalogue and Enroll in Something that Looks Useful."
            action={{ label: "Browse Courses", to: "/" }}
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
                      Next: {current?.title ?? "All Lessons Complete"}
                    </p>
                    <Button asChild className="mt-5 w-full">
                      <Link to="/app/learn/$courseId" params={{ courseId: course.id }}>
                        Continue Learning
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
