import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { EmptyState } from "@/components/lms/ui-bits";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/completed")({
  head: () => ({
    meta: [
      { title: "Completed courses — Lumen LMS" },
      { name: "description", content: "Every course you've finished on Lumen LMS, ready to revisit any time." },
      { property: "og:title", content: "Completed courses — Lumen LMS" },
      { property: "og:description", content: "Courses you've finished on Lumen LMS." },
    ],
  }),
  component: CompletedCourses,
});

function CompletedCourses() {
  const { data, currentUser } = useLms();
  const s = useSelectors();
  const user = currentUser!;
  const completed = data.enrollments.filter((e) => e.studentId === user.id && e.status === "completed");

  return (
    <AppShell nav={studentNav} title="Completed courses" subtitle={`${completed.length} finished`}>
      {completed.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed courses yet"
          description="Finish every lesson in a course and it will show up here."
          action={{ label: "Go to my courses", to: "/app/my-courses" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {completed.map((e) => {
            const course = data.courses.find((c) => c.id === e.courseId);
            if (!course) return null;
            return (
              <CourseCard
                key={e.id}
                course={course}
                lessonCount={s.publishedLessonsOfCourse(course.id).length}
                progress={{ percent: 100, label: "Completed" }}
                footer={{ label: "Review course", to: "/app/learn/$courseId", params: { courseId: course.id } }}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
