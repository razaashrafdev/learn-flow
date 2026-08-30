import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/lms/ui-bits";
import type { Course, CourseLevel, CourseStatus, CourseType, Lesson, PricingType } from "@/lib/lms/types";
import { parseDurationToSeconds } from "@/lib/helpers";

export type CourseFormValues = {
  title: string;
  shortDescription: string;
  thumbnail: string;
  duration: string;
  instructor: string;
  level: CourseLevel;
  pricingType: PricingType;
  courseType: CourseType;
  status: CourseStatus;
  price: number;
  showOnCoursesPage: boolean;
  showOnHomePage: boolean;
  homePagePosition: number | null;
};

function calcTotalHours(lessons: Lesson[]): string {
  let totalSeconds = 0;
  for (const l of lessons) {
    if (!l.published) continue;
    totalSeconds += parseDurationToSeconds(l.duration);
  }
  if (totalSeconds === 0) return "1h";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

const schema = z.object({
  title: z.string().trim().min(3, "Title Is Required").max(120),
  shortDescription: z.string().trim().min(10, "Write a Short Summary").max(200),
  thumbnail: z.string().trim().min(1, "Thumbnail is required").max(6000000),
  duration: z.string().trim().min(1, "Add a Duration").max(20),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
  pricingType: z.enum(["free", "paid"]),
  courseType: z.enum(["live", "recorded"]),
  price: z.number().min(0),
});

export const emptyCourse = (): CourseFormValues => ({
  title: "",
  shortDescription: "",
  thumbnail: "",
  duration: "1h",
  instructor: "Hamza Bhatti",
  level: "Beginner",
  pricingType: "free",
  courseType: "recorded",
  status: "draft",
  price: 0,
  showOnCoursesPage: true,
  showOnHomePage: false,
  homePagePosition: null,
});

export function toFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail,
    duration: course.duration,
    instructor: "Hamza Bhatti",
    level: course.level,
    pricingType: course.pricingType,
    courseType: course.courseType ?? "recorded",
    status: course.status,
    price: course.price ?? 0,
    showOnCoursesPage: course.showOnCoursesPage ?? true,
    showOnHomePage: course.showOnHomePage ?? false,
    homePagePosition: course.homePagePosition ?? null,
  };
}

export function CourseForm({
  initial,
  submitLabel,
  onSubmit,
  lessons,
  allCourses,
  currentCourseId,
}: {
  initial: CourseFormValues;
  submitLabel: string;
  onSubmit: (values: CourseFormValues) => void | Promise<void>;
  lessons?: Lesson[];
  allCourses?: Course[];
  currentCourseId?: string;
}) {
  const [values, setValues] = useState<CourseFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const manualDuration = useRef(false);

  useEffect(() => {
    if (lessons && lessons.length > 0 && !manualDuration.current) {
      setValues((s) => ({ ...s, duration: calcTotalHours(lessons) }));
    }
  }, [lessons]);

  const set = <K extends keyof CourseFormValues>(key: K, v: CourseFormValues[K]) =>
    setValues((s) => ({ ...s, [key]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    await onSubmit(values);
  };

  return (
    <form onSubmit={submit} className="card-surface w-full space-y-5 p-6">
      <div className="space-y-1.5">
        <Label>Thumbnail</Label>
        <ImageUpload
          value={values.thumbnail}
          onChange={(v) => set("thumbnail", v)}
          className="w-full"
        />
        {errors["thumbnail"] ? (
          <p className="text-xs font-medium text-destructive">{errors["thumbnail"]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={values.title}
          maxLength={120}
          onChange={(e) => set("title", e.target.value)}
        />
        {errors["title"] ? (
          <p className="text-xs font-medium text-destructive">{errors["title"]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="short">Short Description</Label>
        <Input
          id="short"
          value={values.shortDescription}
          maxLength={200}
          onChange={(e) => set("shortDescription", e.target.value)}
        />
        {errors["shortDescription"] ? (
          <p className="text-xs font-medium text-destructive">{errors["shortDescription"]}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={values.duration}
            maxLength={20}
            placeholder="6h"
            onChange={(e) => {
              manualDuration.current = true;
              set("duration", e.target.value);
            }}
          />
          {errors["duration"] ? (
            <p className="text-xs font-medium text-destructive">{errors["duration"]}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as CourseStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Pricing</Label>
          <Select
            value={values.pricingType}
            onValueChange={(v) => set("pricingType", v as PricingType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {values.pricingType === "paid" && (
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (Rs.)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={values.price || ""}
              placeholder="999"
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Course Type</Label>
          <Select
            value={values.courseType}
            onValueChange={(v) => set("courseType", v as CourseType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="recorded">Recorded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Home Page Position</Label>
          <Select
            value={values.homePagePosition != null ? String(values.homePagePosition) : "none"}
            onValueChange={(v) => set("homePagePosition", v === "none" ? null : Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="No Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Position</SelectItem>
              {[1, 2, 3].map((pos) => {
                const occupiedByOther = (allCourses ?? []).some(
                  (c) => c.homePagePosition === pos && c.id !== currentCourseId,
                );
                return (
                  <SelectItem key={pos} value={String(pos)} disabled={occupiedByOther}>
                    Position {pos}{occupiedByOther ? " (Occupied)" : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label htmlFor="showOnCoursesPage" className="cursor-pointer text-sm font-medium">
            Show on Courses Page
          </Label>
          <Switch
            id="showOnCoursesPage"
            checked={values.showOnCoursesPage}
            onCheckedChange={(checked) => {
              set("showOnCoursesPage", checked);
              if (!checked) {
                set("showOnHomePage", false);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label
            htmlFor="showOnHomePage"
            className={`cursor-pointer text-sm font-medium ${!values.showOnCoursesPage ? "text-muted-foreground" : ""}`}
          >
            Show on Home Page
          </Label>
          <Switch
            id="showOnHomePage"
            checked={values.showOnHomePage}
            disabled={!values.showOnCoursesPage}
            onCheckedChange={(checked) => {
              if (checked) {
                const homepageCount = (allCourses ?? []).filter(
                  (c) => c.showOnHomePage && c.id !== currentCourseId,
                ).length;
                if (homepageCount >= 3) {
                  toast.error(
                    "Only 3 courses can be shown on the Home Page. Please remove one of the existing courses first.",
                  );
                  return;
                }
              }
              set("showOnHomePage", checked);
              if (!checked) set("homePagePosition", null);
            }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full self-start sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
