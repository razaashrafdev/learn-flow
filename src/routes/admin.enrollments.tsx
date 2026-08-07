import { createFileRoute } from "@tanstack/react-router";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { ProgressRow, StatusPill } from "@/components/lms/ui-bits";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/enrollments")({
  head: () => ({
    meta: [
      { title: "Enrollments — Lumen LMS admin" },
      { name: "description", content: "Every student enrollment across the Lumen LMS catalogue with live progress." },
      { property: "og:title", content: "Enrollments — Lumen LMS admin" },
      { property: "og:description", content: "Track Lumen LMS enrollments and completion." },
    ],
  }),
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const { data } = useLms();
  const s = useSelectors();
  const rows = data.enrollments.slice().sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));

  return (
    <AppShell nav={adminNav} title="Enrollments" subtitle={`${rows.length} enrollments`}>
      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Course</th>
              <th className="px-5 py-3 font-semibold">Enrolled</th>
              <th className="px-5 py-3 font-semibold">Progress</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((e) => {
              const student = data.users.find((u) => u.id === e.studentId);
              const course = data.courses.find((c) => c.id === e.courseId);
              const p = s.courseProgress(e.studentId, e.courseId);
              return (
                <tr key={e.id}>
                  <td className="px-5 py-3 font-medium">{student?.name ?? "Unknown"}</td>
                  <td className="max-w-[240px] truncate px-5 py-3">{course?.title ?? "Deleted course"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td className="w-48 px-5 py-3"><ProgressRow percent={p.percent} /></td>
                  <td className="px-5 py-3"><StatusPill status={e.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
