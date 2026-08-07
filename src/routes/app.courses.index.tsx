import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { CardGridSkeleton, EmptyState } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/courses/")({
  head: () => ({
    meta: [
      { title: "Browse courses — Lumen LMS" },
      { name: "description", content: "Search and filter the full Lumen LMS course catalogue by category and level." },
      { property: "og:title", content: "Browse courses — Lumen LMS" },
      { property: "og:description", content: "Search the Lumen LMS course catalogue." },
    ],
  }),
  component: BrowseCourses,
});

const PAGE_SIZE = 6;

function BrowseCourses() {
  const { data, currentUser, ready } = useLms();
  const s = useSelectors();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.courses
      .filter((c) => c.status === "published")
      .filter((c) => (category === "all" ? true : c.categoryId === category))
      .filter((c) => (level === "all" ? true : c.level === level))
      .filter((c) =>
        q
          ? c.title.toLowerCase().includes(q) ||
            c.shortDescription.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            s.categoryName(c.categoryId).toLowerCase().includes(q)
          : true,
      );
  }, [data.courses, query, category, level, s]);

  const shown = results.slice(0, visible);

  return (
    <AppShell nav={studentNav} title="Browse courses" subtitle={`${results.length} published courses`}>
      <div className="card-surface mb-6 grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            maxLength={120}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by title, description or category"
            className="pl-9"
            aria-label="Search courses"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setVisible(PAGE_SIZE);
          }}
        >
          <SelectTrigger className="md:w-48" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {data.categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={level}
          onValueChange={(v) => {
            setLevel(v);
            setVisible(PAGE_SIZE);
          }}
        >
          <SelectTrigger className="md:w-44" aria-label="Filter by level">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {["Beginner", "Intermediate", "Advanced", "All Levels"].map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!ready ? (
        <CardGridSkeleton />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses match your filters"
          description="Try a different search term, or clear the category and level filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setLevel("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((course) => {
              const enrolled = currentUser ? s.enrollmentOf(currentUser.id, course.id) : null;
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  categoryName={s.categoryName(course.categoryId)}
                  lessonCount={s.publishedLessonsOfCourse(course.id).length}
                  footer={
                    enrolled
                      ? { label: "Continue learning", to: "/app/learn/$courseId", params: { courseId: course.id } }
                      : { label: "View course", to: "/app/courses/$courseId", params: { courseId: course.id } }
                  }
                />
              );
            })}
          </div>

          {visible < results.length ? (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more courses
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AppShell>
  );
}
