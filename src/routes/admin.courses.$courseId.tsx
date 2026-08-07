import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { CourseForm, toFormValues } from "@/components/lms/course-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Edit course — Lumen LMS admin" },
      { name: "description", content: "Edit course details and build the curriculum with sections and YouTube lessons." },
      { property: "og:title", content: "Edit course — Lumen LMS admin" },
      { property: "og:description", content: "Edit a Lumen LMS course and its curriculum." },
    ],
  }),
  component: EditCourse,
});

function EditCourse() {
  const { courseId } = useParams({ from: "/admin/courses/$courseId" });
  const { data, updateCourse, createSection, deleteSection, moveSection, createLesson, deleteLesson, moveLesson } = useLms();
  const course = data.courses.find((c) => c.id === courseId);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonDraft, setLessonDraft] = useState<Record<string, { title: string; url: string; duration: string }>>({});

  if (!course) {
    return (
      <AppShell nav={adminNav} title="Course not found">
        <p className="text-sm text-muted-foreground">This course no longer exists.</p>
      </AppShell>
    );
  }

  const sections = data.sections.filter((s) => s.courseId === course.id).sort((a, b) => a.order - b.order);

  return (
    <AppShell nav={adminNav} title="Edit course" subtitle={course.title}>
      <Button asChild variant="ghost" className="mb-4 -ml-2 w-fit">
        <Link to="/admin/courses"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link>
      </Button>
      <Tabs defaultValue="details">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="curriculum" className="flex-1">Curriculum</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-5">
          <CourseForm
            initial={toFormValues(course)}
            submitLabel="Save Changes"
            onSubmit={(values) => {
              updateCourse(course.id, values);
              toast.success("Course updated");
            }}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="mt-5 space-y-5">
          <form
            className="card-surface flex flex-col gap-3 p-5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (sectionTitle.trim().length < 2) return;
              createSection(course.id, sectionTitle.trim());
              setSectionTitle("");
              toast.success("Section added");
            }}
          >
            <Input
              value={sectionTitle}
              maxLength={100}
              placeholder="New section title"
              aria-label="New section title"
              onChange={(e) => setSectionTitle(e.target.value)}
            />
            <Button type="submit" className="shrink-0"><Plus className="mr-1 h-4 w-4" />Add section</Button>
          </form>

          {sections.map((section) => {
            const lessons = data.lessons.filter((l) => l.sectionId === section.id).sort((a, b) => a.order - b.order);
            const draft = lessonDraft[section.id] ?? { title: "", url: "", duration: "10:00" };
            return (
              <div key={section.id} className="card-surface p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="truncate font-bold">{section.title}</h3>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" aria-label="Move section up" onClick={() => moveSection(section.id, -1)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Move section down" onClick={() => moveSection(section.id, 1)}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete section"
                      onClick={() => { deleteSection(section.id); toast.success("Section deleted"); }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <ul className="mt-3 divide-y divide-border">
                  {lessons.map((l) => (
                    <li key={l.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{l.duration} · {l.youtubeVideoId}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon" aria-label="Move lesson up" onClick={() => moveLesson(l.id, -1)}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Move lesson down" onClick={() => moveLesson(l.id, 1)}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete lesson" onClick={() => { deleteLesson(l.id); toast.success("Lesson deleted"); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                <form
                  className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const res = createLesson(section.id, {
                      title: draft.title.trim(),
                      description: "",
                      youtubeUrl: draft.url.trim(),
                      duration: draft.duration.trim() || "10:00",
                      freePreview: false,
                      published: true,
                    });
                    if (!res.ok) { toast.error(res.error ?? "Could not add lesson"); return; }
                    setLessonDraft({ ...lessonDraft, [section.id]: { title: "", url: "", duration: "10:00" } });
                    toast.success("Lesson added");
                  }}
                >
                  <Input
                    value={draft.title}
                    maxLength={120}
                    placeholder="Lesson title"
                    aria-label="Lesson title"
                    onChange={(e) => setLessonDraft({ ...lessonDraft, [section.id]: { ...draft, title: e.target.value } })}
                  />
                  <Input
                    value={draft.url}
                    maxLength={300}
                    placeholder="YouTube URL"
                    aria-label="YouTube URL"
                    onChange={(e) => setLessonDraft({ ...lessonDraft, [section.id]: { ...draft, url: e.target.value } })}
                  />
                  <Input
                    value={draft.duration}
                    maxLength={10}
                    placeholder="12:30"
                    aria-label="Lesson duration"
                    onChange={(e) => setLessonDraft({ ...lessonDraft, [section.id]: { ...draft, duration: e.target.value } })}
                  />
                  <Button type="submit" variant="secondary" className="shrink-0">Add lesson</Button>
                </form>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
