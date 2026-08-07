import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";
import { AuthAside } from "@/components/lms/auth-aside";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Lumen LMS" },
      {
        name: "description",
        content: "Sign in to Lumen LMS to continue your courses or manage your learning platform.",
      },
      { property: "og:title", content: "Sign in — Lumen LMS" },
      { property: "og:description", content: "Sign in to continue learning on Lumen LMS." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const { signIn, currentUser, ready } = useLms();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && currentUser) {
      navigate({
        to: currentUser.role === "admin" ? "/admin/dashboard" : "/app/dashboard",
        replace: true,
      });
    }
  }, [ready, currentUser, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    window.setTimeout(() => {
      const result = signIn(parsed.data.email, parsed.data.password, remember);
      setLoading(false);
      if (!result.ok) {
        toast.error(result.error ?? "Unable to sign in");
        setErrors({ password: result.error ?? "" });
        return;
      }
      toast.success("Welcome back");
    }, 350);
  };

  const quickFill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Lumen</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Sign in to your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Continue where you left off, or manage your platform.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors["email"]}
                placeholder="you@example.com"
              />
              {errors["email"] ? (
                <p className="text-xs font-medium text-destructive">{errors["email"]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                maxLength={128}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors["password"]}
                placeholder="••••••••"
              />
              {errors["password"] ? (
                <p className="text-xs font-medium text-destructive">{errors["password"]}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                  aria-label="Remember me"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Lumen?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create a student account
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Demo accounts
            </p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => quickFill("admin@lms.dev", "admin123")}
                className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <span className="font-semibold">Admin</span> · admin@lms.dev / admin123
              </button>
              <button
                type="button"
                onClick={() => quickFill("jonah@student.dev", "student123")}
                className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <span className="font-semibold">Student</span> · jonah@student.dev / student123
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthAside />
    </div>
  );
}
