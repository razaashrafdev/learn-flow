import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";
import { AuthAside } from "@/components/lms/auth-aside";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your student account — Hamza Visuals LMS" },
      {
        name: "description",
        content: "Register as a student on Hamza Visuals LMS and start learning with structured video courses.",
      },
      { property: "og:title", content: "Create your student account — Hamza Visuals LMS" },
      { property: "og:description", content: "Register free and start learning on Hamza Visuals LMS." },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
    password: z.string().min(8, "Use at least 8 characters").max(128),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

function RegisterPage() {
  const { register } = useLms();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    window.setTimeout(() => {
      const result = register(parsed.data.name, parsed.data.email, parsed.data.password);
      setLoading(false);
      if (!result.ok) {
        toast.error(result.error ?? "Could not create the account");
        setErrors({ email: result.error ?? "" });
        return;
      }
      toast.success("Account created — welcome to Hamza Visuals");
      navigate({ to: "/app/dashboard", replace: true });
    }, 400);
  };

  const fields: { key: keyof typeof form; label: string; type: string; autoComplete: string; placeholder: string }[] = [
    { key: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "Alex Morgan" },
    { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", autoComplete: "new-password", placeholder: "At least 8 characters" },
    { key: "confirm", label: "Confirm password", type: "password", autoComplete: "new-password", placeholder: "Repeat your password" },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Create your student account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Free to join. Enroll in any published course straight away.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  maxLength={255}
                  onChange={set(f.key)}
                  aria-invalid={!!errors[f.key]}
                />
                {errors[f.key] ? (
                  <p className="text-xs font-medium text-destructive">{errors[f.key]}</p>
                ) : null}
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Admin accounts are created by the platform owner and cannot be registered here.
          </p>
        </div>
      </div>

      <AuthAside />
    </div>
  );
}
