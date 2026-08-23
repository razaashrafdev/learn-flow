import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, PlayCircle, Tag, ChevronRight, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRow } from "@/components/lms/ui-bits";
import type { Course, Lesson } from "@/lib/lms/types";
import { cn } from "@/lib/utils";

function formatLessonsDuration(lessons: Lesson[]): string {
  if (lessons.length === 0) return "";
  const total = lessons.reduce((acc, l) => {
    const colonMatch = /^(\d+):(\d+)$/.exec(l.duration);
    if (colonMatch) {
      return acc + parseInt(colonMatch[1]!, 10);
    }
    const minMatch = /(\d+)\s*min/.exec(l.duration);
    if (minMatch) {
      return acc + parseInt(minMatch[1]!, 10);
    }
    const numMatch = /^(\d+)$/.exec(l.duration);
    if (numMatch) {
      return acc + parseInt(numMatch[1]!, 10);
    }
    return acc;
  }, 0);
  if (total === 0) return "";
  const h = Math.floor(total / 60);
  const min = total % 60;
  if (h > 0 && min > 0) return `${h}h ${min}m`;
  if (h > 0) return `${h}h`;
  return `${min}m`;
}

export function CourseCard({
  course,
  lessonCount,
  progress,
  footer,
  pending,
  enrollmentStatus,
  appLink,
  completed,
  lessons,
}: {
  course: Course;
  lessonCount: number;
  progress?: { percent: number; label?: string };
  footer?: { label: string; to: string; params?: Record<string, string> };
  pending?: boolean;
  enrollmentStatus?: "pending" | "accepted" | "rejected";
  appLink?: boolean;
  completed?: boolean;
  lessons?: Lesson[];
}) {
  const detailTo = appLink ? "/app/courses/$slug" : "/courses/$slug";
  const isRejected = enrollmentStatus === "rejected";
  const isPending = pending || enrollmentStatus === "pending";
  const displayDuration = (lessons && lessons.length > 0 ? formatLessonsDuration(lessons) : "") || course.duration;
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
        {completed && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-success/80 px-2.5 py-1 text-xs font-bold text-success-foreground backdrop-blur-sm">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
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
            <Clock className="h-3.5 w-3.5" /> {displayDuration}
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
          {isRejected ? (
            <Button className="w-full" disabled variant="destructive">
              Request Rejected
            </Button>
          ) : isPending ? (
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
  lessons,
}: {
  course: Course;
  lessonCount: number;
  lessons?: Lesson[];
}) {
  const displayDuration = (lessons && lessons.length > 0 ? formatLessonsDuration(lessons) : "") || course.duration;
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
            <Clock className="h-3.5 w-3.5" /> {displayDuration}
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
