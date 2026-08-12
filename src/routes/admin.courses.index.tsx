import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { EmptyState, StatusPill, Pagination } from "@/components/lms/ui-bits";
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
      { title: "Courses — Hamza Visuals LMS Admin" },
      { name: "description", content: "Create, Edit, Publish and Remove Courses on Your Hamza Visuals LMS Platform." },
      { property: "og:title", content: "Courses — Hamza Visuals LMS Admin" },
      { property: "og:description", content: "Manage the Hamza Visuals LMS Course Catalogue." },
    ],
  }),
  component: AdminCourses,
});

function AdminCourses() {
  const { data, toggleCourseStatus, deleteCourse } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const PAGE_SIZE = 10;
  const allCourses = data.courses.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(allCourses.length / PAGE_SIZE));
  const courses = allCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search Courses"
          aria-label="Search Courses"
          className="max-w-sm"
        />
        <Button asChild className="sm:w-auto">
          <Link to="/admin/courses/new"><Plus className="mr-1 h-4 w-4" />Add Course</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          description="Create Your First Course and Start Adding Sections and Video Lessons."
          action={{ label: "Add Course", to: "/admin/courses/new" }}
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
                            toast.success(c.status === "published" ? "Course Unpublished" : "Course Published");
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

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={allCourses.length}
        PAGE_SIZE={PAGE_SIZE}
        setPage={setPage}
      />

      {detailsId && (() => {
        const c = data.courses.find((co) => co.id === detailsId);
        if (!c) return null;
        const lessons = s.lessonsOfCourse(c.id);
        const enrolled = data.enrollments.filter((e) => e.courseId === c.id).length;
        return (
          <AlertDialog open onOpenChange={(o) => !o && setDetailsId(null)}>
            <AlertDialogContent className="gap-0 p-0 overflow-hidden sm:max-w-md">
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                <h2 className="text-center text-lg font-bold tracking-tight">{c.title}</h2>
              </div>

              <div className="px-6 py-5 space-y-4">
                <img src={c.thumbnail} alt="" className="w-full rounded-lg object-cover aspect-video" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Duration</p>
                    <p className="mt-0.5 text-sm font-medium">{c.duration}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Created</p>
                    <p className="mt-0.5 text-sm font-medium">{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Level</p>
                    <p className="mt-0.5 text-sm font-medium">{c.level}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Lessons</p>
                    <p className="mt-0.5 text-sm font-medium">{lessons.length}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Students</p>
                    <p className="mt-0.5 text-sm font-medium">{enrolled}</p>
                  </div>
                </div>
                {c.shortDescription && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.shortDescription}</p>
                )}
              </div>

              <div className="border-t border-border px-6 py-3.5">
                <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete This Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Its Sections, Lessons, Enrollments and Progress Records Will Be Removed. This Cannot Be Undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteCourse(pendingDelete);
                setPendingDelete(null);
                toast.success("Course Deleted");
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
