import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { EmptyState } from "@/components/lms/ui-bits";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/my-courses")({
  head: () => ({
    meta: [
      { title: "My courses — Lumen LMS" },
      { name: "description", content: "All the courses you're enrolled in, with live progress for each." },
      { property: "og:title", content: "My courses — Lumen LMS" },
      { property: "og:description", content: "Your enrolled courses and progress on Lumen LMS." },
    ],
  }),
  component: MyCourses,
});

function MyCourses() {
  const { data, currentUser } = useLms();
  const s = useSelectors();
  const user = currentUser!;
  const enrollments = data.enrollments.filter((e) => e.studentId === user.id);

  return (
    <AppShell nav={studentNav} title="My courses" subtitle={`${enrollments.length} enrolled`}>
      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You haven't enrolled in any courses"
          description="Once you enroll, your courses and progress will appear here."
          action={{ label: "Browse courses", to: "/app/courses" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((e) => {
            const course = data.courses.find((c) => c.id === e.courseId);
            if (!course) return null;
            const progress = s.courseProgress(user.id, course.id);
            return (
              <CourseCard
                key={e.id}
                course={course}
                lessonCount={s.publishedLessonsOfCourse(course.id).length}
                progress={{ percent: progress.percent, label: `${progress.done}/${progress.total} lessons complete` }}
                footer={{
                  label: e.status === "completed" ? "Review course" : "Continue learning",
                  to: "/app/learn/$courseId",
                  params: { courseId: course.id },
                }}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
