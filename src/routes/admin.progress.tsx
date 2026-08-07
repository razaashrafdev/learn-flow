import { createFileRoute } from "@tanstack/react-router";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { ProgressRow } from "@/components/lms/ui-bits";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Lumen LMS admin" },
      { name: "description", content: "Average completion per course and per learner across Lumen LMS." },
      { property: "og:title", content: "Progress — Lumen LMS admin" },
      { property: "og:description", content: "Completion analytics for Lumen LMS courses and learners." },
    ],
  }),
  component: AdminProgress,
});

function AdminProgress() {
  const { data } = useLms();
  const s = useSelectors();

  const byCourse = data.courses.map((c) => {
    const enrolled = data.enrollments.filter((e) => e.courseId === c.id);
    const avg = enrolled.length
      ? Math.round(enrolled.reduce((a, e) => a + s.courseProgress(e.studentId, c.id).percent, 0) / enrolled.length)
      : 0;
    const completed = enrolled.filter((e) => s.courseProgress(e.studentId, c.id).percent === 100).length;
    return { course: c, students: enrolled.length, avg, completed };
  });

  const byStudent = s.studentsList().map((u) => {
    const enrolled = data.enrollments.filter((e) => e.studentId === u.id);
    const avg = enrolled.length
      ? Math.round(enrolled.reduce((a, e) => a + s.courseProgress(u.id, e.courseId).percent, 0) / enrolled.length)
      : 0;
    return { user: u, enrolled: enrolled.length, avg };
  });

  return (
    <AppShell nav={adminNav} title="Progress" subtitle="Completion analytics">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-surface min-w-0 p-5">
          <h2 className="text-base font-bold">By course</h2>
          <ul className="mt-4 space-y-4">
            {byCourse.map(({ course, students, avg, completed }) => (
              <li key={course.id} className="min-w-0">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <p className="truncate text-sm font-semibold">{course.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{students} enrolled · {completed} done</span>
                </div>
                <div className="mt-1.5"><ProgressRow percent={avg} /></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface min-w-0 p-5">
          <h2 className="text-base font-bold">By student</h2>
          <ul className="mt-4 space-y-4">
            {byStudent.map(({ user, enrolled, avg }) => (
              <li key={user.id} className="min-w-0">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{enrolled} courses</span>
                </div>
                <div className="mt-1.5"><ProgressRow percent={avg} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
