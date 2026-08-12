import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course, CourseLevel, CourseStatus, PricingType } from "@/lib/lms/types";

export type CourseFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  duration: string;
  instructor: string;
  level: CourseLevel;
  pricingType: PricingType;
  status: CourseStatus;
};

const schema = z.object({
  title: z.string().trim().min(3, "Title Is Required").max(120),
  shortDescription: z.string().trim().min(10, "Write a Short Summary").max(200),
  description: z.string().trim().min(20, "Add a Fuller Description").max(4000),
  thumbnail: z.string().trim().url("Enter a Valid Image URL").max(600),
  duration: z.string().trim().min(1, "Add a Duration").max(20),
  instructor: z.string().trim().min(2, "Add an Instructor Name").max(80),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
  pricingType: z.enum(["free", "paid"]),
});

export const emptyCourse = (): CourseFormValues => ({
  title: "",
  shortDescription: "",
  description: "",
  thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  duration: "1h",
  instructor: "Hamza Bhatti",
  level: "Beginner",
  pricingType: "free",
  status: "draft",
});

export function toFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    thumbnail: course.thumbnail,
    duration: course.duration,
    instructor: course.instructor,
    level: course.level,
    pricingType: course.pricingType,
    status: course.status,
  };
}

export function CourseForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: CourseFormValues;
  submitLabel: string;
  onSubmit: (values: CourseFormValues) => void;
}) {
  const [values, setValues] = useState<CourseFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CourseFormValues>(key: K, v: CourseFormValues[K]) =>
    setValues((s) => ({ ...s, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} className="card-surface w-full space-y-5 p-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Course Title</Label>
        <Input id="title" value={values.title} maxLength={120} onChange={(e) => set("title", e.target.value)} />
        {errors["title"] ? <p className="text-xs font-medium text-destructive">{errors["title"]}</p> : null}
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

      <div className="space-y-1.5">
        <Label htmlFor="desc">Full Description</Label>
        <Textarea id="desc" rows={5} value={values.description} maxLength={4000} onChange={(e) => set("description", e.target.value)} />
        {errors["description"] ? (
          <p className="text-xs font-medium text-destructive">{errors["description"]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thumb">Thumbnail URL</Label>
        <Input id="thumb" value={values.thumbnail} maxLength={600} onChange={(e) => set("thumbnail", e.target.value)} />
        {errors["thumbnail"] ? <p className="text-xs font-medium text-destructive">{errors["thumbnail"]}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" value={values.duration} maxLength={20} placeholder="6h" onChange={(e) => set("duration", e.target.value)} />
          {errors["duration"] ? <p className="text-xs font-medium text-destructive">{errors["duration"]}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as CourseStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Pricing</Label>
          <Select value={values.pricingType} onValueChange={(v) => set("pricingType", v as PricingType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructor">Instructor</Label>
          <Input id="instructor" value={values.instructor} maxLength={80} onChange={(e) => set("instructor", e.target.value)} />
          {errors["instructor"] ? <p className="text-xs font-medium text-destructive">{errors["instructor"]}</p> : null}
        </div>
      </div>

      <Button type="submit" className="w-full self-start sm:w-auto">{submitLabel}</Button>
    </form>
  );
}
