import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { EmptyState, StatusPill } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const courses = data.courses.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <AppShell
      nav={adminNav}
      title="Courses"
      subtitle={`${data.courses.length} total`}
      actions={
        <Button asChild>
          <Link to="/admin/courses/new">Add course</Link>
        </Button>
      }
    >
      <div className="mb-5 max-w-sm">
        <Input
          value={query}
          maxLength={120}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
        />
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
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Level</th>
                <th className="px-5 py-3 font-semibold">Lessons</th>
                <th className="px-5 py-3 font-semibold">Students</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={c.thumbnail} alt="" loading="lazy" className="h-10 w-16 shrink-0 rounded-md object-cover" />
                      <span className="max-w-[240px] truncate font-semibold">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.categoryName(c.categoryId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.level}</td>
                  <td className="px-5 py-3">{s.lessonsOfCourse(c.id).length}</td>
                  <td className="px-5 py-3">{data.enrollments.filter((e) => e.courseId === c.id).length}</td>
                  <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit course"
                        onClick={() => navigate({ to: "/admin/courses/$courseId", params: { courseId: c.id } })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={c.status === "published" ? "Unpublish" : "Publish"}
                        onClick={() => {
                          toggleCourseStatus(c.id);
                          toast.success(c.status === "published" ? "Course unpublished" : "Course published");
                        }}
                      >
                        {c.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete course"
                        onClick={() => setPendingDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
