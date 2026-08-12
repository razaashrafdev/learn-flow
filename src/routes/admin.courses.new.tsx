import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { CourseForm, emptyCourse } from "@/components/lms/course-form";
import { Button } from "@/components/ui/button";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/courses/new")({
  head: () => ({
    meta: [
      { title: "Add a Course — Hamza Visuals LMS Admin" },
      { name: "description", content: "Create a New Course with a Category, Level, Duration and Instructor." },
      { property: "og:title", content: "Add a Course — Hamza Visuals LMS Admin" },
      { property: "og:description", content: "Create a New Course on Hamza Visuals LMS." },
    ],
  }),
  component: NewCourse,
});

function NewCourse() {
  const { createCourse } = useLms();
  const navigate = useNavigate();

  return (
    <AppShell nav={adminNav} title="Add Course" subtitle="Step 1 — Course Details">
      <Button asChild variant="ghost" className="mb-4 -ml-2 w-fit">
        <Link to="/admin/courses"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link>
      </Button>
      <CourseForm
        initial={emptyCourse()}
        submitLabel="Create Course"
        onSubmit={(values) => {
          const course = createCourse({ ...values, categoryId: "" });
          toast.success("Course Created — Now Add Sections and Lessons");
          navigate({ to: "/admin/courses/$courseId", params: { courseId: course.id } });
        }}
      />
    </AppShell>
  );
}
