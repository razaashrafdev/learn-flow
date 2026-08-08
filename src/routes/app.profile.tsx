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
      { title: "Your Profile — Lumen LMS" },
      { name: "description", content: "Update Your Name, Email, Profile Picture and Password on Lumen LMS." },
      { property: "og:title", content: "Your Profile — Lumen LMS" },
      { property: "og:description", content: "Manage Your Lumen LMS Account Details." },
    ],
  }),
  component: ProfilePage,
});

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter Your Full Name").max(80),
  email: z.string().trim().email("Enter a Valid Email Address").max(255),
  avatar: z.string().trim().max(500).optional().or(z.literal("")),
});

export function ProfileForms({ nav, title }: { nav: typeof studentNav; title: string }) {
  const { currentUser, updateProfile, changePassword } = useLms();
  const user = currentUser!;
  const [form, setForm] = useState({ name: user.name, email: user.email, avatar: user.avatar ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const saveSettings = (e: React.FormEvent) => {
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

    if (pw.next || pw.confirm || pw.current) {
      const fe: Record<string, string> = {};
      if (pw.next.length < 8) fe["next"] = "Use at Least 8 Characters";
      if (pw.next !== pw.confirm) fe["confirm"] = "Passwords Do Not Match";
      setPwErrors(fe);
      if (Object.keys(fe).length) return;
      const result = changePassword(pw.current, pw.next);
      if (!result.ok) {
        setPwErrors({ current: result.error ?? "" });
        toast.error(result.error ?? "Could Not Change Password");
        return;
      }
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Settings Updated & Password Changed");
    } else {
      toast.success("Settings Updated");
    }
  };

  return (
    <AppShell nav={nav} title={title} subtitle="Manage Your Account Details">
      <form onSubmit={saveSettings} className="card-surface w-full p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors["name"] ? <p className="text-xs font-medium text-destructive">{errors["name"]}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} maxLength={255} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors["email"] ? <p className="text-xs font-medium text-destructive">{errors["email"]}</p> : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {([
            ["current", "Current Password"],
            ["next", "New Password"],
            ["confirm", "Confirm New Password"],
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

        <Button type="submit" className="mt-6 w-full sm:w-auto">Save Settings</Button>
      </form>
    </AppShell>
  );
}

function ProfilePage() {
  return <ProfileForms nav={studentNav} title="Profile" />;
}
