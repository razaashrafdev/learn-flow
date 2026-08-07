import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell, initials, studentNav } from "@/components/lms/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Lumen LMS" },
      { name: "description", content: "Update your name, email, profile picture and password on Lumen LMS." },
      { property: "og:title", content: "Your profile — Lumen LMS" },
      { property: "og:description", content: "Manage your Lumen LMS account details." },
    ],
  }),
  component: ProfilePage,
});

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(255),
  avatar: z.string().trim().max(500).optional().or(z.literal("")),
});

export function ProfileForms({ nav, title }: { nav: typeof studentNav; title: string }) {
  const { currentUser, updateProfile, changePassword } = useLms();
  const user = currentUser!;
  const [form, setForm] = useState({ name: user.name, email: user.email, avatar: user.avatar ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    updateProfile({ name: parsed.data.name, email: parsed.data.email, avatar: parsed.data.avatar ?? "" });
    toast.success("Profile updated");
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (pw.next.length < 8) fe["next"] = "Use at least 8 characters";
    if (pw.next !== pw.confirm) fe["confirm"] = "Passwords do not match";
    setPwErrors(fe);
    if (Object.keys(fe).length) return;
    const result = changePassword(pw.current, pw.next);
    if (!result.ok) {
      setPwErrors({ current: result.error ?? "" });
      toast.error(result.error ?? "Could not change password");
      return;
    }
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  };

  return (
    <AppShell nav={nav} title={title} subtitle="Manage your account details">
      <div className="grid max-w-3xl gap-6">
        <form onSubmit={saveProfile} className="card-surface p-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              {form.avatar ? <AvatarImage src={form.avatar} alt="" /> : null}
              <AvatarFallback className="bg-primary-soft font-bold text-accent-foreground">
                {initials(form.name || user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-bold">{user.name}</p>
              <p className="truncate text-sm capitalize text-muted-foreground">
                {user.role} · joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors["name"] ? <p className="text-xs font-medium text-destructive">{errors["name"]}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} maxLength={255} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors["email"] ? <p className="text-xs font-medium text-destructive">{errors["email"]}</p> : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="avatar">Profile picture URL</Label>
              <Input id="avatar" value={form.avatar} maxLength={500} placeholder="https://…" onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            </div>
          </div>

          <Button type="submit" className="mt-6">Save changes</Button>
        </form>

        <form onSubmit={savePassword} className="card-surface p-6">
          <h2 className="text-base font-bold">Change password</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {([
              ["current", "Current password"],
              ["next", "New password"],
              ["confirm", "Confirm new password"],
            ] as const).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="password"
                  value={pw[key]}
                  maxLength={128}
                  onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
                />
                {pwErrors[key] ? <p className="text-xs font-medium text-destructive">{pwErrors[key]}</p> : null}
              </div>
            ))}
          </div>
          <Button type="submit" className="mt-6">Update password</Button>
        </form>
      </div>
    </AppShell>
  );
}

function ProfilePage() {
  return <ProfileForms nav={studentNav} title="Profile" />;
}
