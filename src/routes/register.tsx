import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, MessageCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLms } from "@/lib/lms/store";
import { storePaymentScreenshot } from "@/lib/lms/store";
import { FadeInSection, ImageUpload } from "@/components/lms/ui-bits";

const WHATSAPP_URL = "https://wa.me/923308923780";

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
  course: z.string().optional(),
});

export const Route = createFileRoute("/register")({
  validateSearch: registerSearchSchema.parse,
  head: () => ({
    meta: [
      { title: "Create your student account — Hamza Visuals LMS" },
      {
        name: "description",
        content:
          "Register as a student on Hamza Visuals LMS and start learning with structured video courses.",
      },
      { property: "og:title", content: "Create your student account — Hamza Visuals LMS" },
      {
        property: "og:description",
        content: "Register free and start learning on Hamza Visuals LMS.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .max(255),
    whatsapp: z.string().max(20, "WhatsApp number is too long").optional(),
    courseId: z.string().min(1, "Please select a course"),
    imageUrl: z.string().optional(),
    password: z.string().min(8, "Use at least 8 characters").max(128),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

function RegisterPage() {
  const { register, data } = useLms();
  const navigate = useNavigate();
  const search = useSearch({ from: "/register" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    courseId: "",
    imageUrl: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [registeredCourseIsPaid, setRegisteredCourseIsPaid] = useState(false);

  const publishedCourses = data.courses.filter((c) => c.status === "published");
  const selectedCourse = publishedCourses.find((c) => c.id === form.courseId);
  const isPaidCourse = selectedCourse?.pricingType === "paid";

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (search.course) {
      const course = publishedCourses.find((c) => c.slug === search.course);
      if (course) {
        setForm((f) => ({ ...f, courseId: course.id }));
        initialized.current = true;
      }
    }
  }, [search.course, publishedCourses]);

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const redirectPath = (r?: string) => (r && r.startsWith("/") && !r.startsWith("//") ? r : null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    if (isPaidCourse && !form.imageUrl) {
      setErrors({ imageUrl: "Payment screenshot is required for paid courses" });
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await register(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.whatsapp,
      parsed.data.courseId,
      parsed.data.imageUrl,
    );
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not create account");
      setErrors({ email: result.error ?? "" });
      return;
    }
    // Store payment screenshot in localStorage for admin verification
    if (isPaidCourse && parsed.data.imageUrl && parsed.data.courseId && result.userId) {
      storePaymentScreenshot(result.userId, parsed.data.courseId, parsed.data.imageUrl);
    }
    setRegisteredCourseIsPaid(isPaidCourse);
    setThankYouOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 opacity-[0.04] [background:radial-gradient(80%_50%_at_50%_-20%,var(--color-primary),transparent)] dark:opacity-[0.06]" />
      <div className="absolute inset-0 [background:radial-gradient(100%_100%_at_50%_0%,transparent_30%,var(--color-background)_100%)] dark:[background:radial-gradient(100%_100%_at_50%_0%,transparent_20%,var(--color-background)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full">
          <FadeInSection>
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Home
            </Link>

            <h1 className="text-2xl font-extrabold tracking-tight">Enroll in Your Course</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill in the details below to create your account and get started.
            </p>
          </FadeInSection>

          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  maxLength={80}
                  onChange={set("name")}
                  aria-invalid={!!errors["name"]}
                />
                {errors["name"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["name"]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+92 300 1234567"
                  value={form.whatsapp}
                  maxLength={20}
                  onChange={set("whatsapp")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                maxLength={255}
                onChange={set("email")}
                aria-invalid={!!errors["email"]}
              />
              {errors["email"] ? (
                <p className="text-xs font-medium text-destructive">{errors["email"]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="courseId">Select Course</Label>
              <select
                id="courseId"
                value={form.courseId}
                onChange={set("courseId")}
                className="flex h-10 w-full [border-radius:5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors["courseId"]}
              >
                <option value="">Choose a course</option>
                {publishedCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} {c.pricingType === "free" ? "(Free)" : `(Rs. ${c.price ?? "N/A"})`}
                  </option>
                ))}
              </select>
              {errors["courseId"] ? (
                <p className="text-xs font-medium text-destructive">{errors["courseId"]}</p>
              ) : null}
            </div>

            {isPaidCourse && (
              <div className="space-y-1.5">
                <Label>Payment Screenshot</Label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                  placeholder="Upload payment screenshot"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Upload your payment receipt or screenshot for verification.
                </p>
                {errors["imageUrl"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["imageUrl"]}</p>
                ) : null}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  maxLength={128}
                  onChange={set("password")}
                  aria-invalid={!!errors["password"]}
                />
                {errors["password"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["password"]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  maxLength={128}
                  onChange={set("confirm")}
                  aria-invalid={!!errors["confirm"]}
                />
                {errors["confirm"] ? (
                  <p className="text-xs font-medium text-destructive">{errors["confirm"]}</p>
                ) : null}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Your Enrollment
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Need help?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <MessageCircle className="h-3 w-3" />
              Contact us on WhatsApp
            </a>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              {...(search.redirect ? { search: { redirect: search.redirect } } : {})}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <DialogTitle className="text-center text-xl">Thank You for Registering!</DialogTitle>
            <DialogDescription className="text-center">
              {registeredCourseIsPaid
                ? "Your account has been created. Since this is a paid course, your enrollment is pending admin approval. You'll receive access once approved."
                : "Your account has been created and you've been enrolled in the course. You can start learning right away!"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3 sm:flex-col">
            <Button asChild className="w-full">
              <Link to="/login">Go to Login Page</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {registeredCourseIsPaid
                ? "You can track your enrollment status after logging in."
                : "Log in to start watching your lessons."}
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
