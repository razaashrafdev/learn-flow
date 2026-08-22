import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import {
  User,
  UserPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useLms, useSelectors } from "@/lib/lms/store";
import type { User as UserType } from "@/lib/lms/types";
import { Pagination } from "@/components/lms/ui-bits";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/students")({
  head: () => ({
    meta: [
      { title: "Students — Hamza Visuals LMS Admin" },
      {
        name: "description",
        content: "Review Every Learner, Their Enrollments and Account Status on Hamza Visuals LMS.",
      },
      { property: "og:title", content: "Students — Hamza Visuals LMS Admin" },
      {
        property: "og:description",
        content: "Manage Hamza Visuals LMS Learners and Their Accounts.",
      },
    ],
  }),
  component: AdminStudents,
});

function AdminStudents() {
  const {
    data,
    setStudentActive,
    createStudent,
    updateStudent,
    changeStudentPassword,
    deleteStudent,
    syncStudents,
  } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");

  useEffect(() => {
    void syncStudents();
  }, [syncStudents]);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<UserType | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", whatsapp: "" });
  const [editForm, setEditForm] = useState({ name: "", email: "", whatsapp: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const PAGE_SIZE = 10;
  const allStudents = s
    .studentsList()
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((u) => (u.name + u.email).toLowerCase().includes(query.trim().toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(allStudents.length / PAGE_SIZE));
  const students = allStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetAddForm = () => setForm({ name: "", email: "", password: "", whatsapp: "" });

  const overallProgress = (studentId: string) => {
    const courseIds = data.enrollments
      .filter((e) => e.studentId === studentId)
      .map((e) => e.courseId);
    if (courseIds.length === 0) return { done: 0, total: 0, percent: 0 };
    let done = 0;
    let total = 0;
    for (const id of courseIds) {
      const p = s.courseProgress(studentId, id);
      done += p.done;
      total += p.total;
    }
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (form.name.trim().length < 2) fe["name"] = "Name Is Required";
    if (!form.email.trim()) fe["email"] = "Email Is Required";
    if (form.password.length < 8) fe["password"] = "Use at Least 8 Characters";
    setErrors(fe);
    if (Object.keys(fe).length) return;

    const result = await createStudent(form.name, form.email, form.password, form.whatsapp);
    if (!result.ok) {
      setErrors({ email: result.error ?? "" });
      return;
    }
    resetAddForm();
    setAddOpen(false);
    toast.success("Student added successfully");
  };

  const openEdit = (student: UserType) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      whatsapp: student.whatsapp ?? "",
      password: "",
    });
    setEditErrors({});
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const fe: Record<string, string> = {};
    if (editForm.name.trim().length < 2) fe["name"] = "Name Is Required";
    if (!editForm.email.trim()) fe["email"] = "Email Is Required";
    if (editForm.password && editForm.password.length < 8)
      fe["password"] = "Use at Least 8 Characters";
    setEditErrors(fe);
    if (Object.keys(fe).length) return;

    const result = await updateStudent(editingStudent.id, {
      name: editForm.name,
      email: editForm.email,
      whatsapp: editForm.whatsapp,
    });
    if (!result.ok) {
      setEditErrors({ email: result.error ?? "" });
      return;
    }
    if (editForm.password) {
      const pwResult = await changeStudentPassword(editingStudent.id, editForm.password);
      if (!pwResult.ok) {
        setEditErrors({ password: pwResult.error ?? "" });
        return;
      }
    }
    setEditOpen(false);
    setEditingStudent(null);
    toast.success("Student updated successfully");
  };

  return (
    <AppShell nav={adminNav} title="Students" subtitle="">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          maxLength={120}
          placeholder="Search Students"
          aria-label="Search Students"
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Dialog
          open={addOpen}
          onOpenChange={(o) => {
            setAddOpen(o);
            if (!o) resetAddForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Fill in the Details to Add a New Student.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  value={form.name}
                  maxLength={80}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors["name"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["name"]}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={form.email}
                  maxLength={255}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors["email"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["email"]}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-whatsapp">WhatsApp Number</Label>
                <Input
                  id="add-whatsapp"
                  value={form.whatsapp}
                  maxLength={20}
                  placeholder="+92 300 1234567"
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  type="password"
                  value={form.password}
                  maxLength={128}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors["password"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["password"]}</p>
                ) : null}
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">S.No</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Student</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Email</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Progress</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Joined</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((u, i) => {
              const prog = overallProgress(u.id);
              return (
                <tr key={u.id}>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </td>
                  <td className="max-w-[120px] px-3 py-3 sm:max-w-none sm:px-5">
                    <span className="block truncate font-semibold">{u.name}</span>
                  </td>
                  <td className="hidden max-w-[220px] truncate px-5 py-3 text-muted-foreground md:table-cell">
                    {u.email}
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    {prog.total > 0 ? (
                      <div className="min-w-[170px]">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {prog.percent}% complete
                        </span>
                        <Progress value={prog.percent} className="mt-1.5 h-1.5" />
                      </div>
                    ) : (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Not enrolled
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-5">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-3 sm:px-5">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailsId(u.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(u)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              void setStudentActive(u.id, u.active === false)
                                .then(() =>
                                  toast.success(
                                    u.active === false ? "Student activated successfully" : "Student deactivated successfully",
                                  ),
                                )
                                .catch(() => toast.error("Could not update student status"));
                            }}
                          >
                            {u.active === false ? (
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            {u.active === false ? "Activate" : "Deactivate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(u.id)}
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
        totalItems={allStudents.length}
        PAGE_SIZE={PAGE_SIZE}
        setPage={setPage}
      />

      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditingStudent(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the Student's Details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                maxLength={80}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              {editErrors["name"] ? (
                <p className="text-xs font-medium text-destructive">{editErrors["name"]}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                maxLength={255}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              {editErrors["email"] ? (
                <p className="text-xs font-medium text-destructive">{editErrors["email"]}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
              <Input
                id="edit-whatsapp"
                value={editForm.whatsapp}
                maxLength={20}
                placeholder="+92 300 1234567"
                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password">New Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                maxLength={128}
                placeholder="Leave Blank to Keep Current"
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
              {editErrors["password"] ? (
                <p className="text-xs font-medium text-destructive">{editErrors["password"]}</p>
              ) : null}
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {detailsId &&
        (() => {
          const u = data.users.find((us) => us.id === detailsId);
          if (!u) return null;
          const studentEnrollments = data.enrollments.filter((e) => e.studentId === u.id);
          const enrolledCourses = studentEnrollments.map((e) => {
            const course = data.courses.find((c) => c.id === e.courseId);
            return { ...e, courseTitle: course?.title ?? "Unknown Course" };
          });
          const isActive = u.active !== false;
          return (
            <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
              <AlertDialogContent className="gap-0 p-0 overflow-y-auto sm:max-w-md max-h-[90vh]">
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                  <h2 className="text-center text-lg font-bold tracking-tight">{u.name}</h2>
                  <p className="mt-0.5 text-center text-sm text-muted-foreground">{u.email}</p>
                  <div className="mt-3 flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        WhatsApp
                      </p>
                      <p className="mt-0.5 text-sm font-medium truncate">{u.whatsapp || "—"}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Joined
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Role
                      </p>
                      <p className="mt-0.5 text-sm font-medium capitalize">{u.role}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Enrolled Courses ({enrolledCourses.length})
                    </p>
                    {enrolledCourses.length > 0 ? (
                      <ul className="space-y-1.5">
                        {enrolledCourses.map((e) => (
                          <li
                            key={e.id}
                            className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-2"
                          >
                            <span className="text-sm font-medium truncate">{e.courseTitle}</span>
                            <span
                              className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                e.accessStatus === "accepted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : e.accessStatus === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {e.accessStatus}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No courses enrolled</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border px-6 py-3.5">
                  <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          );
        })()}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete This Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This Will Permanently Remove the Student and All Their Enrollments and Progress. This
              Cannot Be Undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  void deleteStudent(deleteId).then(() => toast.success("Student deleted successfully")).catch(() => toast.error("Could not delete student"));
                }
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
