import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

import { AppShell, adminNav } from "@/components/lms/app-shell";
import { Pagination } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/lms/ui-bits";
import { useLms } from "@/lib/lms/store";
import type { Resource } from "@/lib/lms/types";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Hamza Visuals LMS admin" },
      { name: "description", content: "Manage downloadable resources for students." },
      { property: "og:title", content: "Resources — Hamza Visuals LMS admin" },
      { property: "og:description", content: "Manage downloadable resources for students." },
    ],
  }),
  component: AdminResources,
});

const PAGE_SIZE = 10;
const emptyForm = {
  title: "",
  description: "",
  type: "",
  image: "",
  downloadUrl: "",
};

function AdminResources() {
  const { data, addResource, updateResource, deleteResource, syncCatalog } = useLms();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);

  useEffect(() => {
    void syncCatalog();
  }, [syncCatalog]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (r: Resource) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      description: r.description,
      type: r.type,
      image: r.image,
      downloadUrl: r.downloadUrl,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.downloadUrl.trim()) {
      toast.error("Title and Download URL are required");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type.trim() || "Other",
      image: form.image.trim(),
      downloadUrl: form.downloadUrl.trim(),
    };
    try {
      if (editingId) {
        await updateResource(editingId, payload);
        toast.success("Resource Updated");
      } else {
        await addResource(payload);
        toast.success("Resource Added");
      }
      resetForm();
      setDialogOpen(false);
    } catch {
      toast.error("Could not save the resource");
    }
  };

  const total = data.resources.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const resources = data.resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell nav={adminNav} title="Resources">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} resources</p>
        <Button onClick={openAdd}>
          <Plus className="mr-1 h-4 w-4" /> Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No resources yet. Add your first resource.
          </p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Heading</th>
                <th className="hidden px-5 py-3 md:table-cell">Type</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r, i) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-5 py-3 text-muted-foreground">
                    {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3 font-medium">{r.title}</td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          void deleteResource(r.id)
                            .then(() => toast.success("Resource Deleted"))
                            .catch(() => toast.error("Could not delete the resource"));
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        PAGE_SIZE={PAGE_SIZE}
        setPage={setPage}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Resource" : "Add Resource"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Image</Label>
              <ImageUpload
                value={form.image}
                onChange={(v) => setForm({ ...form, image: v })}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-title">Title *</Label>
              <Input
                id="res-title"
                value={form.title}
                maxLength={120}
                placeholder="Resource title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-desc">Description</Label>
              <Textarea
                id="res-desc"
                rows={3}
                value={form.description}
                maxLength={400}
                placeholder="Short description"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="res-type">Type</Label>
                <Input
                  id="res-type"
                  value={form.type}
                  maxLength={40}
                  placeholder="UI Kit, Guide..."
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="res-url">Download URL *</Label>
                <Input
                  id="res-url"
                  value={form.downloadUrl}
                  maxLength={600}
                  placeholder="https://..."
                  onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Update" : "Add Resource"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
