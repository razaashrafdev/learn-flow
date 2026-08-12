import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, CheckCircle2, XCircle, BookOpen } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { Pagination } from "@/components/lms/ui-bits";
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
      { title: "Enrollments — Hamza Visuals LMS Admin" },
      { name: "description", content: "Every Student Enrollment Across the Hamza Visuals LMS Catalogue with Live Progress." },
      { property: "og:title", content: "Enrollments — Hamza Visuals LMS Admin" },
      { property: "og:description", content: "Track Hamza Visuals LMS Enrollments and Completion." },
    ],
  }),
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const { data, setStudentActive } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const PAGE_SIZE = 10;
  const allRows = data.enrollments
    .slice()
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .filter((e) => {
      const student = data.users.find((u) => u.id === e.studentId);
      const course = data.courses.find((c) => c.id === e.courseId);
      const searchStr = (student?.name ?? "") + (course?.title ?? "");
      return searchStr.toLowerCase().includes(query.trim().toLowerCase());
    });
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const rows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell nav={adminNav} title="Enrollments"       subtitle="">
      <div className="mb-5 max-w-sm">
        <Input value={query} maxLength={120} placeholder="Search by Student or Course" aria-label="Search Enrollments" onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">S.No</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Student</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Course</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Enrolled</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((e, i) => {
              const student = data.users.find((u) => u.id === e.studentId);
              const course = data.courses.find((c) => c.id === e.courseId);
              const isActive = student?.active !== false;
              return (
                <tr key={e.id}>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{String(i + 1).padStart(2, '0')}</td>
                  <td className="max-w-[120px] px-3 py-3 sm:max-w-none sm:px-5">
                    <span className="block truncate font-medium">{student?.name ?? "Unknown"}</span>
                  </td>
                  <td className="hidden max-w-[240px] truncate px-5 py-3 md:table-cell">{course?.title ?? "Deleted Course"}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{new Date(e.enrolledAt).toLocaleDateString()}</td>
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
                            toast.success(isActive ? "Student Deactivated" : "Student Activated");
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

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={allRows.length}
        PAGE_SIZE={PAGE_SIZE}
        setPage={setPage}
      />

      {detailsId && (() => {
        const e = rows.find((r) => r.id === detailsId);
        if (!e) return null;
        const student = data.users.find((u) => u.id === e.studentId);
        const course = data.courses.find((c) => c.id === e.courseId);
        const p = s.courseProgress(e.studentId, e.courseId);
        const isCompleted = e.status === "completed";
        const isActive = student?.active !== false;
        return (
          <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
            <AlertDialogContent className="gap-0 p-0 overflow-hidden sm:max-w-md">
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                <h2 className="text-center text-lg font-bold tracking-tight">{student?.name ?? "Unknown"}</h2>
                <p className="mt-0.5 text-center text-sm text-muted-foreground">{course?.title ?? "Deleted Course"}</p>
                <div className="mt-3 flex justify-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-blue-500" : "bg-red-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Progress</p>
                    <p className="mt-0.5 text-sm font-medium">{p.done}/{p.total} Lessons ({p.percent}%)</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Enrolled</p>
                    <p className="mt-0.5 text-sm font-medium">{new Date(e.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-6 py-3.5">
                <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}
    </AppShell>
  );
}
