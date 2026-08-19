import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Users, ClipboardList } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { EmptyState, StatCard, StatusPill } from "@/components/lms/ui-bits";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Platform Overview: Students, Courses, Enrollments and Recent Activity.",
      },
      { property: "og:title", content: "Admin Dashboard — Hamza Visuals LMS" },
      {
        property: "og:description",
        content: "Platform Overview for Hamza Visuals LMS Administrators.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useLms();
  const s = useSelectors();

  const students = s.studentsList();
  const recent = data.enrollments
    .slice()
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .slice(0, 5);

  const popular = data.courses
    .map((c) => ({
      course: c,
      count: data.enrollments.filter((e) => e.courseId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <AppShell nav={adminNav} title="Dashboard" subtitle="">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total Students" value={students.length} icon={Users} />
        <StatCard label="Total Courses" value={data.courses.length} icon={BookOpen} />
        <StatCard label="Total Enrollments" value={data.enrollments.length} icon={ClipboardList} />
      </div>

      <section className="mt-9 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="card-surface min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-base font-bold">Recent Enrollments</h2>
            <Link
              to="/admin/enrollments"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-muted-foreground">No Enrollments Yet.</p>
            </div>
          ) : (
            <div>
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Course</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((e) => {
                    const student = data.users.find((u) => u.id === e.studentId);
                    const course = data.courses.find((c) => c.id === e.courseId);
                    const accessStatus = e.accessStatus ?? "pending";
                    return (
                      <tr key={e.id}>
                        <td className="px-5 py-3 font-medium">{student?.name ?? "Unknown"}</td>
                        <td className="px-5 py-3 text-muted-foreground truncate max-w-[150px] hidden sm:table-cell">
                          {course?.title ?? "Deleted Course"}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(e.enrolledAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <StatusPill status={accessStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-surface min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-base font-bold">Popular Courses</h2>
            <Link
              to="/admin/courses"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {popular.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={BookOpen}
                title="No Courses Yet"
                description="Create Your First Course to See It Here."
                action={{ label: "Add Course", to: "/admin/courses/new" }}
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {popular.map(({ course, count }) => (
                <li key={course.id} className="flex min-w-0 items-center gap-3 px-5 py-3">
                  <img
                    src={course.thumbnail}
                    alt=""
                    loading="lazy"
                    className="h-12 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{course.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{count} Students Enrolled</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
