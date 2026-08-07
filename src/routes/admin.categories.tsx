import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Lumen LMS admin" },
      { name: "description", content: "Create and manage the categories used to organise courses on Lumen LMS." },
      { property: "og:title", content: "Categories — Lumen LMS admin" },
      { property: "og:description", content: "Organise the Lumen LMS catalogue with categories." },
    ],
  }),
  component: AdminCategories,
});

function AdminCategories() {
  const { data, createCategory, deleteCategory } = useLms();
  const [form, setForm] = useState({ name: "", description: "" });

  return (
    <AppShell nav={adminNav} title="Categories" subtitle={`${data.categories.length} categories`}>
      <form
        className="card-surface mb-6 grid max-w-3xl gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (form.name.trim().length < 2) { toast.error("Enter a category name"); return; }
          createCategory(form.name.trim(), form.description.trim());
          setForm({ name: "", description: "" });
          toast.success("Category created");
        }}
      >
        <Input value={form.name} maxLength={60} placeholder="Category name" aria-label="Category name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input value={form.description} maxLength={160} placeholder="Short description" aria-label="Category description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button type="submit" className="shrink-0">Add</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((c) => {
          const count = data.courses.filter((x) => x.categoryId === c.id).length;
          return (
            <div key={c.id} className="card-surface grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-5">
              <div className="min-w-0">
                <p className="truncate font-bold">{c.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-2 text-xs font-semibold text-primary">{count} course{count === 1 ? "" : "s"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${c.name}`}
                className="shrink-0"
                onClick={() => {
                  const res = deleteCategory(c.id);
                  if (!res.ok) { toast.error(res.error ?? "Cannot delete"); return; }
                  toast.success("Category deleted");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
