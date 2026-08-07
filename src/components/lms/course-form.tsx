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
import type { Category, Course, CourseLevel, CourseStatus } from "@/lib/lms/types";

export type CourseFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  level: CourseLevel;
  duration: string;
  instructor: string;
  status: CourseStatus;
};

const schema = z.object({
  title: z.string().trim().min(3, "Title is required").max(120),
  shortDescription: z.string().trim().min(10, "Write a short summary").max(200),
  description: z.string().trim().min(20, "Add a fuller description").max(4000),
  thumbnail: z.string().trim().url("Enter a valid image URL").max(600),
  categoryId: z.string().min(1, "Pick a category"),
  duration: z.string().trim().min(1, "Add a duration").max(20),
  instructor: z.string().trim().min(2, "Add an instructor name").max(80),
});

export const emptyCourse = (categoryId: string): CourseFormValues => ({
  title: "",
  shortDescription: "",
  description: "",
  thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  categoryId,
  level: "Beginner",
  duration: "1h",
  instructor: "",
  status: "draft",
});

export function toFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    thumbnail: course.thumbnail,
    categoryId: course.categoryId,
    level: course.level,
    duration: course.duration,
    instructor: course.instructor,
    status: course.status,
  };
}

export function CourseForm({
  initial,
  categories,
  submitLabel,
  onSubmit,
}: {
  initial: CourseFormValues;
  categories: Category[];
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
    <form onSubmit={submit} className="card-surface max-w-3xl space-y-5 p-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Course title</Label>
        <Input id="title" value={values.title} maxLength={120} onChange={(e) => set("title", e.target.value)} />
        {errors["title"] ? <p className="text-xs font-medium text-destructive">{errors["title"]}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="short">Short description</Label>
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
        <Label htmlFor="desc">Full description</Label>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={values.categoryId} onValueChange={(v) => set("categoryId", v)}>
            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors["categoryId"] ? <p className="text-xs font-medium text-destructive">{errors["categoryId"]}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label>Level</Label>
          <Select value={values.level} onValueChange={(v) => set("level", v as CourseLevel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["Beginner", "Intermediate", "Advanced", "All Levels"] as CourseLevel[]).map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" value={values.duration} maxLength={20} placeholder="6h" onChange={(e) => set("duration", e.target.value)} />
          {errors["duration"] ? <p className="text-xs font-medium text-destructive">{errors["duration"]}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructor">Instructor</Label>
          <Input id="instructor" value={values.instructor} maxLength={80} onChange={(e) => set("instructor", e.target.value)} />
          {errors["instructor"] ? <p className="text-xs font-medium text-destructive">{errors["instructor"]}</p> : null}
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
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
