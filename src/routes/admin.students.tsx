import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserPlus, MoreHorizontal, Pencil, Trash2, CheckCircle2, XCircle, BookOpen } from "lucide-react";
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
  const { data, setStudentActive, createStudent, updateStudent, changeStudentPassword, deleteStudent } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<UserType | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", whatsapp: "" });
  const [editForm, setEditForm] = useState({ name: "", email: "", whatsapp: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const students = s
    .studentsList()
    .filter((u) => (u.name + u.email).toLowerCase().includes(query.trim().toLowerCase()));

  const resetAddForm = () => setForm({ name: "", email: "", password: "", whatsapp: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (form.name.trim().length < 2) fe["name"] = "Name is required";
    if (!form.email.trim()) fe["email"] = "Email is required";
    if (form.password.length < 8) fe["password"] = "Use at least 8 characters";
    setErrors(fe);
    if (Object.keys(fe).length) return;

    const result = createStudent(form.name, form.email, form.password, form.whatsapp);
    if (!result.ok) {
      setErrors({ email: result.error ?? "" });
      return;
    }
    resetAddForm();
    setAddOpen(false);
    toast.success("Student added");
  };

  const openEdit = (student: UserType) => {
    setEditingStudent(student);
    setEditForm({ name: student.name, email: student.email, whatsapp: student.whatsapp ?? "", password: "" });
    setEditErrors({});
    setEditOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const fe: Record<string, string> = {};
    if (editForm.name.trim().length < 2) fe["name"] = "Name is required";
    if (!editForm.email.trim()) fe["email"] = "Email is required";
    if (editForm.password && editForm.password.length < 8) fe["password"] = "Use at least 8 characters";
    setEditErrors(fe);
    if (Object.keys(fe).length) return;

    const result = updateStudent(editingStudent.id, { name: editForm.name, email: editForm.email, whatsapp: editForm.whatsapp });
    if (!result.ok) {
      setEditErrors({ email: result.error ?? "" });
      return;
    }
    if (editForm.password) {
      changeStudentPassword(editingStudent.id, editForm.password);
    }
    setEditOpen(false);
    setEditingStudent(null);
    toast.success("Student updated");
  };

  return (
    <AppShell nav={adminNav} title="Students"       subtitle="">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input value={query} maxLength={120} placeholder="Search students" aria-label="Search students" onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetAddForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Fill in the details to add a new student.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-name">Full name</Label>
                <Input id="add-name" value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors["name"] ? <p className="text-xs font-medium text-destructive">{errors["name"]}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-email">Email</Label>
                <Input id="add-email" type="email" value={form.email} maxLength={255} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors["email"] ? <p className="text-xs font-medium text-destructive">{errors["email"]}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-whatsapp">WhatsApp number</Label>
                <Input id="add-whatsapp" value={form.whatsapp} maxLength={20} placeholder="+92 300 1234567" onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-password">Password</Label>
                <Input id="add-password" type="password" value={form.password} maxLength={128} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                {errors["password"] ? <p className="text-xs font-medium text-destructive">{errors["password"]}</p> : null}
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
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
              <th className="px-3 py-3 font-semibold sm:px-5">Student</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Email</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">Enrolled</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Joined</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((u) => (
              <tr key={u.id}>
                <td className="max-w-[120px] px-3 py-3 sm:max-w-none sm:px-5">
                  <span className="block truncate font-semibold">{u.name}</span>
                </td>
                <td className="hidden max-w-[220px] truncate px-5 py-3 text-muted-foreground md:table-cell">{u.email}</td>
                <td className="hidden px-5 py-3 md:table-cell">{data.enrollments.filter((e) => e.studentId === u.id).length}</td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-5">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-2 py-3 sm:px-5">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="md:hidden" onClick={() => setDetailsId(u.id)}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(u)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setStudentActive(u.id, u.active === false);
                          toast.success(u.active === false ? "Student activated" : "Student deactivated");
                        }}>
                          {u.active === false ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                          {u.active === false ? "Activate" : "Deactivate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(u.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditingStudent(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student's details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Full name</Label>
              <Input id="edit-name" value={editForm.name} maxLength={80} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              {editErrors["name"] ? <p className="text-xs font-medium text-destructive">{editErrors["name"]}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editForm.email} maxLength={255} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              {editErrors["email"] ? <p className="text-xs font-medium text-destructive">{editErrors["email"]}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-whatsapp">WhatsApp number</Label>
              <Input id="edit-whatsapp" value={editForm.whatsapp} maxLength={20} placeholder="+92 300 1234567" onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password">New password</Label>
              <Input id="edit-password" type="password" value={editForm.password} maxLength={128} placeholder="Leave blank to keep current" onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              {editErrors["password"] ? <p className="text-xs font-medium text-destructive">{editErrors["password"]}</p> : null}
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {detailsId && (() => {
        const u = data.users.find((us) => us.id === detailsId);
        if (!u) return null;
        const enrolled = data.enrollments.filter((e) => e.studentId === u.id).length;
        return (
          <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{u.name}</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Email:</span> {u.email}</div>
                  <div><span className="text-muted-foreground">WhatsApp:</span> {u.whatsapp ?? "—"}</div>
                  <div><span className="text-muted-foreground">Enrolled:</span> {enrolled}</div>
                  <div><span className="text-muted-foreground">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}</div>
                  <div><span className="text-muted-foreground">Status:</span> {u.active !== false ? "Active" : "Inactive"}</div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student and all their enrollments and progress. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteStudent(deleteId);
                  toast.success("Student deleted");
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
