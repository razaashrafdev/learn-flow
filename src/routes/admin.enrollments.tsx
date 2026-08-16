import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MoreHorizontal,
  XCircle,
  BookOpen,
  Check,
  ChevronDown,
  Eye,
  Filter,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Clock,
} from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { Pagination, StatusPill } from "@/components/lms/ui-bits";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLms, useSelectors, getPaymentScreenshot } from "@/lib/lms/store";
import type { EnrollmentState, Enrollment } from "@/lib/lms/types";

export const Route = createFileRoute("/admin/enrollments")({
  head: () => ({
    meta: [
      { title: "Enrollments — Hamza Visuals LMS Admin" },
      {
        name: "description",
        content:
          "Every Student Enrollment Across the Hamza Visuals LMS Catalogue with Live Progress.",
      },
      { property: "og:title", content: "Enrollments — Hamza Visuals LMS Admin" },
      {
        property: "og:description",
        content: "Track Hamza Visuals LMS Enrollments and Completion.",
      },
    ],
  }),
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const { data, deleteEnrollment, setEnrollmentStatus, syncEnrollments, syncStudents } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<EnrollmentState | "all">("all");
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    kind: "delete";
  } | null>(null);

  const statusLabels: Record<EnrollmentState | "all", string> = {
    all: "All Statuses",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };
  const statusOptions = ["all", "pending", "accepted", "rejected"] as const;

  useEffect(() => {
    void syncStudents();
    void syncEnrollments();
  }, [syncStudents, syncEnrollments]);

  const runStatus = async (id: string, status: EnrollmentState, message: string) => {
    try {
      await setEnrollmentStatus(id, status);
      toast.success(message);
    } catch {
      toast.error("Could not update the enrollment");
    }
  };

  const PAGE_SIZE = 10;
  const allRows = data.enrollments
    .slice()
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .filter((e) => {
      if (filter !== "all" && (e.accessStatus ?? "pending") !== filter) return false;
      const student = data.users.find((u) => u.id === e.studentId);
      const course = data.courses.find((c) => c.id === e.courseId);
      const searchStr = (student?.name ?? "") + (course?.title ?? "");
      return searchStr.toLowerCase().includes(query.trim().toLowerCase());
    });
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const rows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell nav={adminNav} title="Enrollments" subtitle="">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          maxLength={120}
          placeholder="Search by Student or Course"
          aria-label="Search Enrollments"
          className="sm:max-w-sm"
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between sm:w-auto">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {statusLabels[filter]}
              </span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map((value) => (
              <DropdownMenuItem
                key={value}
                className={filter === value ? "bg-primary-soft text-accent-foreground" : undefined}
                onClick={() => {
                  setFilter(value);
                  setPage(1);
                }}
              >
                {statusLabels[value]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">S.No</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Student</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Course</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Status</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Enrolled</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((e, i) => {
              const student = data.users.find((u) => u.id === e.studentId);
              const course = data.courses.find((c) => c.id === e.courseId);
              const accessStatus: EnrollmentState = e.accessStatus ?? "pending";
              const hasAccess = accessStatus === "accepted";
              return (
                <tr key={e.id}>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="max-w-[120px] px-3 py-3 sm:max-w-none sm:px-5">
                    <span className="block truncate font-medium">{student?.name ?? "Unknown"}</span>
                  </td>
                  <td className="hidden max-w-[240px] truncate px-5 py-3 md:table-cell">
                    {course?.title ?? "Deleted Course"}
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <StatusPill status={accessStatus} />
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {new Date(e.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-3 sm:px-5">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailsId(e.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditId(e.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setConfirmAction({ id: e.id, kind: "delete" })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

      {/* Enrollment Detail Dialog */}
      {detailsId && (
        <EnrollmentDetailDialog
          enrollmentId={detailsId}
          onClose={() => setDetailsId(null)}
          data={data}
          onApprove={(id) => runStatus(id, "accepted", "Enrollment Approved")}
          onReject={(id) => runStatus(id, "rejected", "Enrollment Rejected")}
        />
      )}

      {confirmAction &&
        (() => {
          const target = data.enrollments.find((e) => e.id === confirmAction.id);
          const student = target ? data.users.find((u) => u.id === target.studentId) : null;
          const course = target ? data.courses.find((c) => c.id === target.courseId) : null;
          return (
            <AlertDialog open onOpenChange={(o) => !o && setConfirmAction(null)}>
              <AlertDialogContent className="sm:max-w-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Enrollment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {student?.name ?? "This student"} — {course?.title ?? "this course"}. This
                    enrollment will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmAction(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setConfirmAction(null);
                      deleteEnrollment(target!.id);
                      toast.success("Enrollment Deleted");
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        })()}

      {/* Edit Status Dialog */}
      {editId && <EditStatusDialog enrollmentId={editId} onClose={() => setEditId(null)} data={data} onSave={(id, status) => { runStatus(id, status, `Enrollment ${status === "accepted" ? "Approved" : "Rejected"}`); setEditId(null); }} />}
    </AppShell>
  );
}

function EnrollmentDetailDialog({
  enrollmentId,
  onClose,
  data,
  onApprove,
  onReject,
}: {
  enrollmentId: string;
  onClose: () => void;
  data: ReturnType<typeof useLms>["data"];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const enrollment = data.enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) return null;

  const student = data.users.find((u) => u.id === enrollment.studentId);
  const accessStatus: EnrollmentState = enrollment.accessStatus ?? "pending";
  const isPending = accessStatus === "pending";
  const paymentScreenshot = getPaymentScreenshot(enrollment.studentId, enrollment.courseId);

  return (
    <AlertDialog open onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="gap-0 p-0 overflow-hidden sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold tracking-tight">Student Details</h2>
        </div>

        <div className="px-6 pb-5 space-y-4">
          {/* Row 1: Name + WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </p>
              <p className="mt-0.5 text-sm font-medium truncate">{student?.name ?? "Unknown"}</p>
            </div>
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                WhatsApp
              </p>
              <p className="mt-0.5 text-sm font-medium truncate">{student?.whatsapp ?? "N/A"}</p>
            </div>
          </div>

          {/* Row 2: Email + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="mt-0.5 text-sm font-medium truncate">{student?.email ?? "N/A"}</p>
            </div>
            <div className="rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Date
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Payment Screenshot */}
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Payment Screenshot
            </p>
            {paymentScreenshot ? (
              <div className="mt-2 overflow-hidden rounded-lg border border-border">
                <img
                  src={paymentScreenshot}
                  alt="Payment Screenshot"
                  className="w-full object-contain max-h-48"
                />
              </div>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground italic">No screenshot uploaded</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          {isPending ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onReject(enrollment.id);
                  onClose();
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onApprove(enrollment.id);
                  onClose();
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          ) : (
            <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditStatusDialog({
  enrollmentId,
  onClose,
  data,
  onSave,
}: {
  enrollmentId: string;
  onClose: () => void;
  data: ReturnType<typeof useLms>["data"];
  onSave: (id: string, status: EnrollmentState) => void;
}) {
  const enrollment = data.enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) return null;

  const student = data.users.find((u) => u.id === enrollment.studentId);
  const course = data.courses.find((c) => c.id === enrollment.courseId);
  const currentStatus: EnrollmentState = enrollment.accessStatus ?? "pending";

  return (
    <AlertDialog open onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="sm:max-w-sm">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle>Edit Enrollment Status</AlertDialogTitle>
          <AlertDialogDescription>
            {student?.name ?? "Unknown"} — {course?.title ?? "Course"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-3">
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Current Status
            </p>
            <p className="mt-0.5 text-sm font-medium capitalize">
              {currentStatus === "accepted"
                ? "Approved"
                : currentStatus === "rejected"
                  ? "Rejected"
                  : "Pending"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Change to:</p>
            <div className="flex gap-2">
              <Button
                variant={currentStatus === "accepted" ? "default" : "outline"}
                className="flex-1"
                disabled={currentStatus === "accepted"}
                onClick={() => onSave(enrollment.id, "accepted")}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant={currentStatus === "rejected" ? "default" : "outline"}
                className="flex-1"
                disabled={currentStatus === "rejected"}
                onClick={() => onSave(enrollment.id, "rejected")}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
