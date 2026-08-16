import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Compass } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { EmptyState } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/my-courses")({
  head: () => ({
    meta: [
      { title: "My Courses — Hamza Visuals LMS" },
      { name: "description", content: "All the Courses You're Enrolled in, with Live Progress for Each." },
      { property: "og:title", content: "My Courses — Hamza Visuals LMS" },
      { property: "og:description", content: "Your Enrolled Courses and Progress on Hamza Visuals LMS." },
    ],
  }),
  component: MyCourses,
});

function MyCourses() {
  const { data, currentUser } = useLms();
  const s = useSelectors();
  const user = currentUser!;
  const enrollments = data.enrollments.filter((e) => e.studentId === user.id && e.status !== "completed");

  return (
    <AppShell nav={studentNav} title="My Courses">
      <div className="mb-6 flex justify-end">
        <Button asChild size="sm">
          <Link to="/app/courses">
            <Compass className="mr-2 h-4 w-4" />
            Browse Courses
          </Link>
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You Haven't Enrolled in Any Courses"
          description="Once You Enroll, Your Courses and Progress Will Appear Here."
          action={{ label: "Browse Courses", to: "/app/courses" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((e) => {
            const course = data.courses.find((c) => c.id === e.courseId);
            if (!course) return null;
            const isPending = e.accessStatus === "pending";
            const progress = s.courseProgress(user.id, course.id);
            return (
              <CourseCard
                key={e.id}
                course={course}
                lessonCount={s.publishedLessonsOfCourse(course.id).length}
                pending={isPending}
                {...(!isPending && { progress: { percent: progress.percent, label: `${progress.done}/${progress.total} lessons complete` } })}
                footer={{
                  label: e.status === "completed" ? "Review Course" : "Continue Learning",
                  to: "/app/learn/$slug",
                  params: { slug: course.slug },
                }}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
