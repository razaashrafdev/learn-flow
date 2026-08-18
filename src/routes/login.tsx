import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLms } from "@/lib/lms/store";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema.parse,
  head: () => ({
    meta: [
      { title: "Sign in — Hamza Visuals LMS" },
      {
        name: "description",
        content:
          "Sign in to Hamza Visuals LMS to continue your courses or manage your learning platform.",
      },
      { property: "og:title", content: "Sign in — Hamza Visuals LMS" },
      { property: "og:description", content: "Sign in to continue learning on Hamza Visuals LMS." },
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
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const redirectPath = (r?: string) => (r && r.startsWith("/") && !r.startsWith("//") ? r : null);

  useEffect(() => {
    if (ready && currentUser) {
      const redirect = redirectPath(search.redirect);
      if (redirect) {
        window.location.assign(redirect);
        return;
      }
      navigate({
        to: currentUser.role === "admin" ? "/admin/dashboard" : "/app/dashboard",
        replace: true,
      });
    }
  }, [ready, currentUser, navigate, search.redirect]);

  const submit = async (e: React.FormEvent) => {
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
    const result = await signIn(parsed.data.email, parsed.data.password, remember);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error ?? "Sign in failed. Please try again");
      setErrors({ password: result.error ?? "" });
      return;
    }
    toast.success("Signed in successfully");
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-start lg:justify-center">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/images/Black-Logo.png"
                alt="Hamza Visuals"
                className="h-9 w-auto dark:hidden"
              />
              <img
                src="/images/White-Logo.png"
                alt="Hamza Visuals"
                className="h-9 w-auto hidden dark:block"
              />
            </Link>
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
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Hamza Visuals?{" "}
            <Link
              to="/register"
              {...(search.redirect ? { search: { redirect: search.redirect } } : {})}
              className="font-semibold text-primary hover:underline"
            >
              Create a student account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
