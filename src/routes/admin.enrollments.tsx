import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, CheckCircle2, XCircle, BookOpen } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { ProgressRow } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const { data, setStudentActive } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const rows = data.enrollments
    .slice()
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .filter((e) => {
      const student = data.users.find((u) => u.id === e.studentId);
      const course = data.courses.find((c) => c.id === e.courseId);
      const searchStr = (student?.name ?? "") + (course?.title ?? "");
      return searchStr.toLowerCase().includes(query.trim().toLowerCase());
    });

  return (
    <AppShell nav={adminNav} title="Enrollments"       subtitle="">
      <div className="mb-5 max-w-sm">
        <Input value={query} maxLength={120} placeholder="Search by student or course" aria-label="Search enrollments" onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">S.No</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Student</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Course</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Enrolled</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Progress</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((e, i) => {
              const student = data.users.find((u) => u.id === e.studentId);
              const course = data.courses.find((c) => c.id === e.courseId);
              const p = s.courseProgress(e.studentId, e.courseId);
              const isActive = student?.active !== false;
              return (
                <tr key={e.id}>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{String(i + 1).padStart(2, '0')}</td>
                  <td className="max-w-[120px] px-3 py-3 sm:max-w-none sm:px-5">
                    <span className="block truncate font-medium">{student?.name ?? "Unknown"}</span>
                  </td>
                  <td className="hidden max-w-[240px] truncate px-5 py-3 md:table-cell">{course?.title ?? "Deleted course"}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td className="px-3 py-3 sm:px-5"><ProgressRow percent={p.percent} /></td>
                  <td className="px-2 py-3 sm:px-5">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="md:hidden" onClick={() => setDetailsId(e.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setStudentActive(e.studentId, !isActive);
                            toast.success(isActive ? "Student deactivated" : "Student activated");
                          }}>
                            {isActive ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            {isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detailsId && (() => {
        const e = rows.find((r) => r.id === detailsId);
        if (!e) return null;
        const student = data.users.find((u) => u.id === e.studentId);
        const course = data.courses.find((c) => c.id === e.courseId);
        const p = s.courseProgress(e.studentId, e.courseId);
        return (
          <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{student?.name ?? "Unknown"}</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Course:</span> {course?.title ?? "Deleted"}</div>
                  <div><span className="text-muted-foreground">Progress:</span> {p.percent}%</div>
                  <div><span className="text-muted-foreground">Enrolled:</span> {new Date(e.enrolledAt).toLocaleDateString()}</div>
                  <div><span className="text-muted-foreground">Status:</span> {e.status === "completed" ? "Completed" : "In Progress"}</div>
                  <div><span className="text-muted-foreground">Student Status:</span> {student?.active !== false ? "Active" : "Inactive"}</div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}
    </AppShell>
  );
}
