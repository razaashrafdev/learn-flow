import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { CourseForm, emptyCourse } from "@/components/lms/course-form";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/courses/new")({
  head: () => ({
    meta: [
      { title: "Add a course — Lumen LMS admin" },
      { name: "description", content: "Create a new course with a category, level, duration and instructor." },
      { property: "og:title", content: "Add a course — Lumen LMS admin" },
      { property: "og:description", content: "Create a new course on Lumen LMS." },
    ],
  }),
  component: NewCourse,
});

function NewCourse() {
  const { data, createCourse } = useLms();
  const navigate = useNavigate();

  return (
    <AppShell nav={adminNav} title="Add course" subtitle="Step 1 — course details">
      <CourseForm
        initial={emptyCourse(data.categories[0]?.id ?? "")}
        categories={data.categories}
        submitLabel="Create course"
        onSubmit={(values) => {
          const course = createCourse(values);
          toast.success("Course created — now add sections and lessons");
          navigate({ to: "/admin/courses/$courseId", params: { courseId: course.id } });
        }}
      />
    </AppShell>
  );
}
