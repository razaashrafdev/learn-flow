import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Compass, Lock, PlayCircle, TrendingUp } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CardGridSkeleton, EmptyState, ProgressRow, StatCard } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Track your enrolled courses, progress and continue learning.",
      },
      { property: "og:title", content: "Your Dashboard — Hamza Visuals LMS" },
      {
        property: "og:description",
        content: "Track your progress and continue learning on Hamza Visuals.",
      },
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
  const pending = enrollments.filter((e) => e.accessStatus === "pending");
  const overall = enrollments.filter((e) => e.accessStatus !== "pending").length
    ? Math.round(
        enrollments
          .filter((e) => e.accessStatus !== "pending")
          .reduce((acc, e) => acc + s.courseProgress(user.id, e.courseId).percent, 0) /
          enrollments.filter((e) => e.accessStatus !== "pending").length,
      )
    : 0;

  const continueList = inProgress
    .filter((e) => e.accessStatus !== "pending")
    .slice()
    .sort((a, b) => (b.lastAccessedAt ?? "").localeCompare(a.lastAccessedAt ?? ""))
    .slice(0, 3);

  return (
    <AppShell
      nav={studentNav}
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      subtitle="Here's where you left off."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Enrolled Courses" value={enrollments.length} icon={BookOpen} />
        <StatCard
          label="In Progress"
          value={inProgress.length - pending.length}
          icon={PlayCircle}
        />
        <StatCard label="Overall Progress" value={`${overall}%`} icon={TrendingUp} />
      </div>

      {/* Pending Approval Section */}
      {pending.length > 0 && (
        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-warning" /> Pending Admin Approval
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {pending.map((e) => {
              const course = data.courses.find((c) => c.id === e.courseId);
              if (!course) return null;
              return (
                <article
                  key={e.id}
                  className="card-surface flex flex-col overflow-hidden opacity-75"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/60 p-3">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-bold">{course.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Waiting for admin to verify payment and approve enrollment.
                    </p>
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1.5 text-xs font-semibold text-warning">
                        <Lock className="h-3 w-3" /> Locked — Pending Approval
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Continue Learning Section */}
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
            title={
              pending.length > 0 ? "No Active Courses Yet" : "You Haven't Started a Course Yet"
            }
            description={
              pending.length > 0
                ? "Your pending courses will appear here once approved."
                : "Browse the catalogue and enroll in something that looks useful."
            }
            action={{ label: "Browse Courses", to: "/app/courses" }}
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
                      <Link to="/app/learn/$slug" params={{ slug: course.slug }}>
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
