import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { CardGridSkeleton, EmptyState } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/courses/")({
  head: () => ({
    meta: [
      { title: "Browse Courses — Hamza Visuals LMS" },
      { name: "description", content: "Search and filter the full Hamza Visuals LMS course catalogue." },
      { property: "og:title", content: "Browse Courses — Hamza Visuals LMS" },
      { property: "og:description", content: "Search the Hamza Visuals LMS course catalogue." },
    ],
  }),
  component: BrowseCourses,
});

const PAGE_SIZE = 6;

function BrowseCourses() {
  const { data, currentUser, ready } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.courses
      .filter((c) => c.status === "published")
      .filter((c) =>
        q
          ? c.title.toLowerCase().includes(q) ||
            c.shortDescription.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
          : true,
      );
  }, [data.courses, query, s]);

  const shown = results.slice(0, visible);

  return (
    <AppShell nav={studentNav} title="Browse Courses">
      <div className="mb-6">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            maxLength={120}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by title or description"
            className="pl-9"
            aria-label="Search Courses"
          />
        </div>
      </div>

      {!ready ? (
        <CardGridSkeleton />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses match your search"
          description="Try a different search term, or clear the search."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
              }}
            >
              Clear Search
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((course) => {
              const enrolled = currentUser ? s.enrollmentOf(currentUser.id, course.id) : null;
              const isPending = enrolled?.accessStatus === "pending";
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonCount={s.publishedLessonsOfCourse(course.id).length}
                  pending={isPending}
                  appLink
                  footer={
                    enrolled
                      ? { label: "Continue Learning", to: "/app/learn/$slug", params: { slug: course.slug } }
                      : { label: "View Course", to: "/app/courses/$slug", params: { slug: course.slug } }
                  }
                />
              );
            })}
          </div>

          {visible < results.length ? (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load More Courses
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AppShell>
  );
}
