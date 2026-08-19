import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, Tag, ChevronRight, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRow } from "@/components/lms/ui-bits";
import type { Course } from "@/lib/lms/types";
import { cn } from "@/lib/utils";

export function CourseCard({
  course,
  lessonCount,
  progress,
  footer,
  pending,
  appLink,
}: {
  course: Course;
  lessonCount: number;
  progress?: { percent: number; label?: string };
  footer?: { label: string; to: string; params?: Record<string, string> };
  pending?: boolean;
  appLink?: boolean;
}) {
  const detailTo = appLink ? "/app/courses/$slug" : "/courses/$slug";
  return (
    <article className="card-surface group flex flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <Link
        to={detailTo}
        params={{ slug: course.slug }}
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        <img
          src={course.thumbnail}
          alt={`${course.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm",
            course.pricingType === "free"
              ? "bg-success/80 text-success-foreground"
              : "bg-warning/80 text-warning-foreground",
          )}
        >
          {course.pricingType === "free" ? "FREE" : "PAID"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug">
          <Link to={detailTo} params={{ slug: course.slug }}>
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
            <Tag className="h-3.5 w-3.5" /> <Link to="/about" className="hover:text-primary transition-colors">{course.instructor}</Link>
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
          {pending ? (
            <Button className="w-full" disabled variant="outline">
              Pending Approval
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link
                to={footer?.to ?? "/courses/$slug"}
                params={footer?.params ?? { slug: course.slug }}
              >
                {footer?.label ?? "View Details"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function LandingCourseCard({
  course,
  lessonCount,
}: {
  course: Course;
  lessonCount: number;
}) {
  return (
    <div className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        <img
          src={course.thumbnail}
          alt={`${course.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm",
            course.pricingType === "free"
              ? "bg-success/80 text-success-foreground"
              : "bg-warning/80 text-warning-foreground",
          )}
        >
          {course.pricingType === "free" ? "FREE" : "PAID"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug group-hover:text-primary transition-colors">
          <Link to="/courses/$slug" params={{ slug: course.slug }} target="_blank" rel="noopener noreferrer">
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
            <Users className="h-3.5 w-3.5" /> <Link to="/about" className="hover:text-primary transition-colors">{course.instructor}</Link>
          </span>
        </div>

        <div className="mt-5">
          <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Link to="/courses/$slug" params={{ slug: course.slug }} target="_blank" rel="noopener noreferrer">
              View Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
