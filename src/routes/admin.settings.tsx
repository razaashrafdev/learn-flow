import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { adminNav, AppShell } from "@/components/lms/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";
import { apiUploadImage } from "@/lib/api";
import { getPopupImageUrl, setPopupImageUrl, removePopupImageUrl } from "@/lib/lms/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hamza Visuals LMS admin" },
      { name: "description", content: "Update the administrator profile and password for your Hamza Visuals LMS platform." },
      { property: "og:title", content: "Settings — Hamza Visuals LMS admin" },
      { property: "og:description", content: "Administrator profile and password settings." },
    ],
  }),
  component: AdminSettings,
});

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter Your Full Name").max(80),
  email: z.string().trim().email("Enter a Valid Email Address").max(255),
});

function AdminSettings() {
  const { currentUser, updateProfile, changePassword } = useLms();
  const user = currentUser!;
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});

    const profileResult = await updateProfile({
      name: parsed.data.name,
      email: parsed.data.email,
    });
    if (!profileResult.ok) {
      setErrors({ email: profileResult.error ?? "" });
      toast.error(profileResult.error ?? "Could not update settings");
      return;
    }

    if (pw.next || pw.confirm || pw.current) {
      const fe: Record<string, string> = {};
      if (pw.next.length < 8) fe["next"] = "Use at least 8 characters";
      if (pw.next !== pw.confirm) fe["confirm"] = "Passwords do not match";
      setPwErrors(fe);
      if (Object.keys(fe).length) return;
      const result = await changePassword(pw.current, pw.next);
      if (!result.ok) {
        setPwErrors({ current: result.error ?? "" });
        toast.error(result.error ?? "Could not change password");
        return;
      }
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Settings and password updated");
    } else {
      toast.success("Settings updated successfully");
    }
  };

  return (
    <AppShell nav={adminNav} title="Settings" subtitle="Manage Your Account Details">
      <form onSubmit={saveSettings} className="card-surface w-full p-6">
        <div className="grid gap-4">
          <div className="grid gap-1.5 sm:grid-cols-[160px_1fr] sm:items-center">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              maxLength={80}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors["name"] ? (
              <p className="text-xs font-medium text-destructive sm:col-start-2">
                {errors["name"]}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-[160px_1fr] sm:items-center">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              maxLength={255}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors["email"] ? (
              <p className="text-xs font-medium text-destructive sm:col-start-2">
                {errors["email"]}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          {(
            [
              ["current", "Current Password"],
              ["next", "New Password"],
              ["confirm", "Confirm New Password"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="grid gap-1.5 sm:grid-cols-[160px_1fr] sm:items-center">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="password"
                value={pw[key]}
                maxLength={128}
                onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
              />
              {pwErrors[key] ? (
                <p className="text-xs font-medium text-destructive sm:col-start-2">
                  {pwErrors[key]}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <Button type="submit" className="mt-6 w-full sm:w-auto">
          Save Settings
        </Button>
      </form>

      <PopupSection />
    </AppShell>
  );
}

function PopupSection() {
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPopupUrl(getPopupImageUrl());
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const url = await apiUploadImage(dataUrl);
      setPopupImageUrl(url);
      setPopupUrl(url);
      toast.success("Popup image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    removePopupImageUrl();
    setPopupUrl(null);
    toast.success("Popup image removed");
  };

  return (
    <div className="card-surface w-full p-6 mt-6">
      <h3 className="text-lg font-bold text-foreground">Website Popup</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a 1080 × 1080 px image to display as a popup on the website.
      </p>

      <div className="mt-4">
        {popupUrl ? (
          <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border">
            <img
              src={popupUrl}
              alt="Popup preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background/50 transition-colors hover:border-primary/50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-xs text-muted-foreground">Upload Image</span>
              </>
            )}
          </label>
        )}
      </div>

      {popupUrl && (
        <p className="mt-3 text-xs text-muted-foreground">
          Image uploaded. Replace by clicking the upload area again.
        </p>
      )}
    </div>
  );
}
