import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, Signal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRow } from "@/components/lms/ui-bits";
import type { Course } from "@/lib/lms/types";

export function CourseCard({
  course,
  lessonCount,
  progress,
  footer,
}: {
  course: Course;
  lessonCount: number;
  progress?: { percent: number; label?: string };
  footer?: { label: string; to: string; params?: Record<string, string> };
}) {
  return (
    <article className="card-surface group flex flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <Link
        to="/app/courses/$courseId"
        params={{ courseId: course.id }}
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        <img
          src={course.thumbnail}
          alt={`${course.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug">
          <Link to="/app/courses/$courseId" params={{ courseId: course.id }}>
            {course.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" /> {lessonCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" /> {course.level}
          </span>
        </div>

        {progress ? (
          <div className="mt-4 space-y-1.5">
            <ProgressRow percent={progress.percent} />
            {progress.label ? (
              <p className="truncate text-xs text-muted-foreground">{progress.label}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 pt-0">
          <Button asChild className="w-full">
            <Link
              to={footer?.to ?? "/app/courses/$courseId"}
              params={footer?.params ?? { courseId: course.id }}
            >
              {footer?.label ?? "View Course"}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
