import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SearchX, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLms, useSelectors } from "@/lib/lms/store";
import { LandingCourseCard } from "@/components/lms/course-card";
import { PublicFooter } from "@/components/lms/ui-bits";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "All Courses — Hamza Visuals" },
      { name: "description", content: "Browse all available courses on Hamza Visuals." },
      { property: "og:title", content: "All Courses — Hamza Visuals" },
      { property: "og:description", content: "Browse all available courses on Hamza Visuals." },
    ],
  }),
  component: CoursesListing,
});

const PAGE_SIZE = 9;

function CoursesListing() {
  const { data, ready } = useLms();
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
  }, [data.courses, query]);

  const shown = results.slice(0, visible);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full catalogue of expert-led courses.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative min-w-0 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              maxLength={120}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search courses..."
              className="pl-9"
              aria-label="Search courses"
            />
          </div>
        </div>

        {!ready ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-surface animate-pulse overflow-hidden">
                <div className="aspect-video bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-bold">No courses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
            <Button variant="outline" className="mt-4" onClick={() => setQuery("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((course) => {
                const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                return (
                  <LandingCourseCard key={course.id} course={course} lessonCount={lessonCount} />
                );
              })}
            </div>

            {visible < results.length && (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load More Courses
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
