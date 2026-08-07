import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Users, ClipboardList } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { EmptyState, ProgressRow, StatCard, StatusPill } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Lumen LMS" },
      { name: "description", content: "Platform overview: students, courses, enrollments and recent activity." },
      { property: "og:title", content: "Admin dashboard — Lumen LMS" },
      { property: "og:description", content: "Platform overview for Lumen LMS administrators." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useLms();
  const s = useSelectors();

  const students = s.studentsList();
  const published = data.courses.filter((c) => c.status === "published");
  const recent = data.enrollments
    .slice()
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .slice(0, 6);

  const popular = data.courses
    .map((c) => ({
      course: c,
      count: data.enrollments.filter((e) => e.courseId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <AppShell
      nav={adminNav}
      title="Dashboard"
      subtitle="Overview of your learning platform"
      actions={
        <Button asChild>
          <Link to="/admin/courses/new">Add course</Link>
        </Button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={students.length} icon={Users} />
        <StatCard label="Total courses" value={data.courses.length} icon={BookOpen} />
        <StatCard label="Published courses" value={published.length} icon={CheckCircle2} />
        <StatCard label="Total enrollments" value={data.enrollments.length} icon={ClipboardList} />
      </div>

      <section className="mt-9 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="card-surface min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-base font-bold">Recent enrollments</h2>
            <Link to="/admin/enrollments" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-muted-foreground">No enrollments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Progress</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((e) => {
                    const student = data.users.find((u) => u.id === e.studentId);
                    const course = data.courses.find((c) => c.id === e.courseId);
                    const p = s.courseProgress(e.studentId, e.courseId);
                    return (
                      <tr key={e.id}>
                        <td className="px-5 py-3 font-medium">{student?.name ?? "Unknown"}</td>
                        <td className="max-w-[220px] truncate px-5 py-3">{course?.title ?? "Deleted course"}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(e.enrolledAt).toLocaleDateString()}
                        </td>
                        <td className="w-40 px-5 py-3">
                          <ProgressRow percent={p.percent} />
                        </td>
                        <td className="px-5 py-3">
                          <StatusPill status={e.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-surface min-w-0 p-5">
          <h2 className="text-base font-bold">Popular courses</h2>
          {popular.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Create your first course to see it here."
              action={{ label: "Add course", to: "/admin/courses/new" }}
            />
          ) : (
            <ul className="mt-4 space-y-4">
              {popular.map(({ course, count }) => {
                const enrolled = data.enrollments.filter((e) => e.courseId === course.id);
                const avg = enrolled.length
                  ? Math.round(
                      enrolled.reduce((a, e) => a + s.courseProgress(e.studentId, course.id).percent, 0) /
                        enrolled.length,
                    )
                  : 0;
                return (
                  <li key={course.id} className="flex min-w-0 items-center gap-3">
                    <img
                      src={course.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-12 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{count} students</p>
                      <div className="mt-1.5">
                        <ProgressRow percent={avg} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
