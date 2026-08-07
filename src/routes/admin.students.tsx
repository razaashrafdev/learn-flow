import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, adminNav, initials } from "@/components/lms/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/students")({
  head: () => ({
    meta: [
      { title: "Students — Lumen LMS admin" },
      { name: "description", content: "Review every learner, their enrollments and account status on Lumen LMS." },
      { property: "og:title", content: "Students — Lumen LMS admin" },
      { property: "og:description", content: "Manage Lumen LMS learners and their accounts." },
    ],
  }),
  component: AdminStudents,
});

function AdminStudents() {
  const { data, setStudentActive } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");

  const students = s
    .studentsList()
    .filter((u) => (u.name + u.email).toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <AppShell nav={adminNav} title="Students" subtitle={`${students.length} learners`}>
      <div className="mb-5 max-w-sm">
        <Input value={query} maxLength={120} placeholder="Search students" aria-label="Search students" onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Enrolled</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3 text-right font-semibold">Account</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      {u.avatar ? <AvatarImage src={u.avatar} alt="" /> : null}
                      <AvatarFallback className="bg-primary-soft text-xs font-bold text-accent-foreground">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="max-w-[220px] truncate px-5 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3">{data.enrollments.filter((e) => e.studentId === u.id).length}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <Button
                    variant={u.active === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStudentActive(u.id, u.active === false);
                      toast.success(u.active === false ? "Student activated" : "Student deactivated");
                    }}
                  >
                    {u.active === false ? "Activate" : "Deactivate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
