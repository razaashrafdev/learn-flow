import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Link2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { CourseForm, toFormValues } from "@/components/lms/course-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/courses/$slug")({
  head: () => ({
    meta: [
      { title: "Edit Course — Hamza Visuals LMS Admin" },
      { name: "description", content: "Edit Course Details and Build the Curriculum with Sections and YouTube Lessons." },
      { property: "og:title", content: "Edit Course — Hamza Visuals LMS Admin" },
      { property: "og:description", content: "Edit a Hamza Visuals LMS Course and Its Curriculum." },
    ],
  }),
  component: EditCourse,
});

function EditCourse() {
  const { slug } = useParams({ from: "/admin/courses/$slug" });
  const { data, updateCourse, createSection, deleteSection, moveSection, createLesson, deleteLesson, moveLesson, updateLesson, syncCatalog } = useLms();
  const course = data.courses.find((c) => c.slug === slug);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonDraft, setLessonDraft] = useState<Record<string, { title: string; url: string; duration: string }>>({});

  useEffect(() => {
    void syncCatalog();
  }, [syncCatalog]);

  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [resourcesLessonId, setResourcesLessonId] = useState<string | null>(null);
  const [resourceLinks, setResourceLinks] = useState<string[]>([""]);

  if (!course) {
    return (
      <AppShell nav={adminNav} title="Course Not Found">
        <p className="text-sm text-muted-foreground">This Course No Longer Exists.</p>
      </AppShell>
    );
  }

  const sections = data.sections.filter((s) => s.courseId === course.id).sort((a, b) => a.order - b.order);

  const openResources = (lessonId: string) => {
    const lesson = data.lessons.find((l) => l.id === lessonId);
    setResourcesLessonId(lessonId);
    setResourceLinks(lesson?.resources?.length ? [...lesson.resources] : [""]);
    setResourcesOpen(true);
  };

  const saveResources = async () => {
    if (!resourcesLessonId) return;
    const filtered = resourceLinks.filter((l) => l.trim() !== "");
    try {
      await updateLesson(resourcesLessonId, { resources: filtered });
      toast.success("Resources Saved");
      setResourcesOpen(false);
    } catch {
      toast.error("Could not save the resources");
    }
  };

  const addResourceLink = () => setResourceLinks([...resourceLinks, ""]);
  const removeResourceLink = (idx: number) => setResourceLinks(resourceLinks.filter((_, i) => i !== idx));

  return (
    <AppShell nav={adminNav} title="Edit Course" subtitle={course.title}>
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
            onSubmit={async (values) => {
              try {
                await updateCourse(course.id, values);
                toast.success("Course Updated");
              } catch {
                toast.error("Could not update the course");
              }
            }}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="mt-5 space-y-5">
          <form
            className="card-surface flex flex-col gap-3 p-5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (sectionTitle.trim().length < 2) return;
              void createSection(course.id, sectionTitle.trim())
                .then(() => { setSectionTitle(""); toast.success("Section Added"); })
                .catch(() => toast.error("Could not add the section"));
            }}
          >
            <Input
              value={sectionTitle}
              maxLength={100}
              placeholder="New Section Title"
              aria-label="New Section Title"
              onChange={(e) => setSectionTitle(e.target.value)}
            />
            <Button type="submit" className="shrink-0"><Plus className="mr-1 h-4 w-4" />Add Section</Button>
          </form>

          {sections.map((section) => {
            const lessons = data.lessons.filter((l) => l.sectionId === section.id).sort((a, b) => a.order - b.order);
            const draft = lessonDraft[section.id] ?? { title: "", url: "", duration: "10:00" };
            return (
              <div key={section.id} className="card-surface p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="truncate font-bold">{section.title}</h3>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" aria-label="Move section up" onClick={() => void moveSection(section.id, -1).catch(() => toast.error("Could not move the section"))}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Move section down" onClick={() => void moveSection(section.id, 1).catch(() => toast.error("Could not move the section"))}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete section"
                      onClick={() => { void deleteSection(section.id).then(() => toast.success("Section Deleted")).catch(() => toast.error("Could not delete the section")); }}
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
                        <Button variant="ghost" size="icon" aria-label="Add resources" onClick={() => openResources(l.id)}>
                          <Link2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Move lesson up" onClick={() => void moveLesson(l.id, -1).catch(() => toast.error("Could not move the lesson"))}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Move lesson down" onClick={() => void moveLesson(l.id, 1).catch(() => toast.error("Could not move the lesson"))}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete lesson" onClick={() => { void deleteLesson(l.id).then(() => toast.success("Lesson Deleted")).catch(() => toast.error("Could not delete the lesson")); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                <form
                  className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto]"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await createLesson(section.id, {
                      title: draft.title.trim(),
                      description: "",
                      youtubeUrl: draft.url.trim(),
                      duration: draft.duration.trim() || "10:00",
                      freePreview: false,
                      published: true,
                    });
                    if (!res.ok) { toast.error(res.error ?? "Could Not Add Lesson"); return; }
                    setLessonDraft({ ...lessonDraft, [section.id]: { title: "", url: "", duration: "10:00" } });
                    toast.success("Lesson Added");
                  }}
                >
                  <Input
                    value={draft.title}
                    maxLength={120}
                    placeholder="Lesson Title"
                    aria-label="Lesson Title"
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
                  <Button type="submit" variant="secondary" className="shrink-0">Add Lesson</Button>
                </form>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>

      <Dialog open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lesson Resources</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {resourceLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={link}
                  placeholder="https://example.com/resource"
                  onChange={(e) => {
                    const updated = [...resourceLinks];
                    updated[idx] = e.target.value;
                    setResourceLinks(updated);
                  }}
                />
                {resourceLinks.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeResourceLink(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addResourceLink} className="w-full">
              <Plus className="mr-1 h-4 w-4" /> Add Link
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResourcesOpen(false)}>Cancel</Button>
            <Button onClick={saveResources}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
