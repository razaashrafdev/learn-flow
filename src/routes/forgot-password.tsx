import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, GraduationCap, MailCheck } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Hamza Visuals LMS" },
      { name: "description", content: "Request a password reset link for your Hamza Visuals LMS account." },
      { property: "og:title", content: "Reset your password — Hamza Visuals LMS" },
      { property: "og:description", content: "Request a password reset link for Hamza Visuals LMS." },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.string().trim().email("Enter a valid email address");

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>
        </div>

        {sent ? (
          <div className="card-surface p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-accent-foreground">
              <MailCheck className="h-5 w-5" />
            </span>
            <h1 className="mt-4 text-lg font-bold">Check your inbox</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              If an account exists for {email}, we&apos;ve sent password reset instructions.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight">Forgot your password?</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={submit} noValidate className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!error}
                />
                {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
              </div>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
