import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Update Your Name, Email, Profile Picture and Password on Hamza Visuals LMS.",
      },
      { property: "og:title", content: "Your Profile — Hamza Visuals LMS" },
      { property: "og:description", content: "Manage Your Hamza Visuals LMS Account Details." },
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
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? "",
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
      avatar: parsed.data.avatar ?? "",
    });
    if (!profileResult.ok) {
      setErrors({ email: profileResult.error ?? "" });
      toast.error(profileResult.error ?? "Could Not Update Settings");
      return;
    }

    if (pw.next || pw.confirm || pw.current) {
      const fe: Record<string, string> = {};
      if (pw.next.length < 8) fe["next"] = "Use at Least 8 Characters";
      if (pw.next !== pw.confirm) fe["confirm"] = "Passwords Do Not Match";
      setPwErrors(fe);
      if (Object.keys(fe).length) return;
      const result = await changePassword(pw.current, pw.next);
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
    </AppShell>
  );
}

function ProfilePage() {
  return <ProfileForms nav={studentNav} title="Profile" />;
}
