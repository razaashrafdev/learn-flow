import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { EmptyState, StatusPill } from "@/components/lms/ui-bits";
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
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — Lumen LMS admin" },
      { name: "description", content: "Create, edit, publish and remove courses on your Lumen LMS platform." },
      { property: "og:title", content: "Courses — Lumen LMS admin" },
      { property: "og:description", content: "Manage the Lumen LMS course catalogue." },
    ],
  }),
  component: AdminCourses,
});

function AdminCourses() {
  const { data, toggleCourseStatus, deleteCourse } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const courses = data.courses.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <AppShell
      nav={adminNav}
      title="Courses"
      subtitle=""
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          maxLength={120}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
          className="max-w-sm"
        />
        <Button asChild className="sm:w-auto">
          <Link to="/admin/courses/new"><Plus className="mr-1 h-4 w-4" />Add Course</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Create your first course and start adding sections and video lessons."
          action={{ label: "Add course", to: "/admin/courses/new" }}
        />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-semibold sm:px-5">Course</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Lessons</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Students</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Status</th>
                <th className="px-3 py-3 font-semibold sm:px-5">Created</th>
                <th className="px-2 py-3 text-right font-semibold sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="max-w-[120px] px-3 py-3 sm:max-w-[240px] sm:px-5">
                    <span className="block truncate font-semibold">{c.title}</span>
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">{s.lessonsOfCourse(c.id).length}</td>
                  <td className="hidden px-5 py-3 md:table-cell">{data.enrollments.filter((e) => e.courseId === c.id).length}</td>
                  <td className="hidden px-5 py-3 md:table-cell"><StatusPill status={c.status} /></td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-5">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-2 py-3 sm:px-5">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="md:hidden" onClick={() => setDetailsId(c.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate({ to: "/admin/courses/$courseId", params: { courseId: c.id } })}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            toggleCourseStatus(c.id);
                            toast.success(c.status === "published" ? "Course unpublished" : "Course published");
                          }}>
                            {c.status === "published" ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {c.status === "published" ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setPendingDelete(c.id)}>
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
      )}

      {detailsId && (() => {
        const c = data.courses.find((co) => co.id === detailsId);
        if (!c) return null;
        const lessons = s.lessonsOfCourse(c.id);
        const enrolled = data.enrollments.filter((e) => e.courseId === c.id).length;
        return (
          <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{c.title}</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-3 text-sm">
                <img src={c.thumbnail} alt="" className="w-full rounded-lg object-cover" />
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Duration:</span> {c.duration}</div>
                  <div><span className="text-muted-foreground">Instructor:</span> {c.instructor}</div>
                  <div><span className="text-muted-foreground">Lessons:</span> {lessons.length}</div>
                  <div><span className="text-muted-foreground">Students:</span> {enrolled}</div>
                  <div><span className="text-muted-foreground">Status:</span> {c.status}</div>
                  <div><span className="text-muted-foreground">Created:</span> {new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <p className="text-muted-foreground">{c.shortDescription}</p>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              Its sections, lessons, enrollments and progress records will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteCourse(pendingDelete);
                setPendingDelete(null);
                toast.success("Course deleted");
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
