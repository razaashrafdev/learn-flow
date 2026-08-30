import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, PlayCircle, Tag, ChevronRight, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRow } from "@/components/lms/ui-bits";
import type { Course, Lesson } from "@/lib/lms/types";
import { cn } from "@/lib/utils";
import { parseDurationToSeconds } from "@/lib/helpers";

function formatLessonsDuration(lessons: Lesson[]): string {
  if (lessons.length === 0) return "";
  const totalSeconds = lessons.reduce((acc, l) => acc + parseDurationToSeconds(l.duration), 0);
  if (totalSeconds === 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const min = Math.floor((totalSeconds % 3600) / 60);
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
            course.courseType === "live"
              ? "bg-red-500/90 text-white"
              : "bg-gray-500/90 text-white",
          )}
        >
          {course.courseType === "live" ? "Live" : "Recorded"}
        </span>
        {completed && (
          <span className="absolute left-3 top-10 flex items-center gap-1 rounded-full bg-success/80 px-2.5 py-1 text-xs font-bold text-success-foreground backdrop-blur-sm">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground backdrop-blur-sm">
          {course.pricingType === "free" ? "Free" : `Rs. ${course.price ?? 0}`}
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
            <Clock className="h-3.5 w-3.5" /> {displayDuration}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> <Link to="/about" className="text-primary hover:text-primary underline transition-colors">{course.instructor}</Link>
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
            course.courseType === "live"
              ? "bg-red-500/90 text-white"
              : "bg-gray-500/90 text-white",
          )}
        >
          {course.courseType === "live" ? "Live" : "Recorded"}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground backdrop-blur-sm">
          {course.pricingType === "free" ? "Free" : `Rs. ${course.price ?? 0}`}
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
            <Users className="h-3.5 w-3.5" /> <Link to="/about" className="text-primary hover:text-primary underline transition-colors">{course.instructor}</Link>
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
