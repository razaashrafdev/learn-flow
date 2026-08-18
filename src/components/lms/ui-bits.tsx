import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Facebook,
  Instagram,
  Youtube,
  Upload,
  XCircle,
  Loader2,
} from "lucide-react";
import { apiUploadImage } from "@/lib/api";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="card-surface p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; to: string } | ReactNode;
}) {
  return (
    <div className="card-surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? (
        <div className="mt-5">
          {typeof action === "object" && action !== null && "to" in (action as object) ? (
            <Button asChild>
              <Link to={(action as { to: string }).to}>{(action as { label: string }).label}</Link>
            </Button>
          ) : (
            (action as ReactNode)
          )}
        </div>
      ) : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-success/12 text-success",
    draft: "bg-muted text-muted-foreground",
    completed: "bg-success/12 text-success",
    in_progress: "bg-primary-soft text-accent-foreground",
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-success/12 text-success",
    rejected: "bg-destructive/10 text-destructive",
    disabled: "bg-destructive/10 text-destructive",
  };
  const label =
    status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        map[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function ProgressRow({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Progress value={percent} className="h-2 flex-1" />
      <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground">
        {percent}%
      </span>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert mt-8 space-y-8 text-muted-foreground">
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  PAGE_SIZE,
  setPage,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  PAGE_SIZE: number;
  setPage: (fn: (p: number) => number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="hidden text-sm text-muted-foreground sm:block">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of{" "}
        {totalItems}
      </p>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <span className="sm:hidden">&lt;</span>
          <span className="hidden sm:inline">Prev</span>
        </Button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
          let p: number;
          if (totalPages <= 3) {
            p = i + 1;
          } else if (page <= 2) {
            p = i + 1;
          } else if (page >= totalPages - 1) {
            p = totalPages - 2 + i;
          } else {
            p = page - 1 + i;
          }
          return (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(() => p)}
            >
              {p}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <span className="sm:hidden">&gt;</span>
          <span className="hidden sm:inline">Next</span>
        </Button>
      </div>
    </div>
  );
}

export function PublicFooter() {
  const navigate = useNavigate();

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("landing.scrollTarget", "services");
      navigate({ to: "/" });
    }
  };

  return (
    <footer className="bg-surface border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
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
            <p className="mt-4 text-sm text-muted-foreground">
              Hamza Visuals teaches practical design, video editing <br className="max-sm:hidden" />
              and AI through project based courses.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/hamzavisuals1"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/hamza.visuals1/"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.threads.com/@hamza.visuals1"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/hamzavisuals1/"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Hamza.Visuals1"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center [border-radius:5px] bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Explore</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Courses
                </Link>
              </li>
              <li>
                <a
                  href="/"
                  onClick={handleServicesClick}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </a>
              </li>
              <li>
                <Link
                  to="/resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center lg:flex lg:items-center lg:justify-between lg:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hamza Visuals. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-muted-foreground lg:mt-0">
            Developed by{" "}
            <a
              href="https://wa.me/923008974168"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline"
            >
              Muhammad Aftab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Upload Image",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isFullWidth = className?.includes("w-full");

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== "string") return;
      setUploading(true);
      try {
        const url = await apiUploadImage(reader.result);
        onChange(url);
      } catch {
        alert("Upload failed — please check your connection and try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className={cn("relative", isFullWidth ? "w-full" : "inline-block")}>
          <img
            src={value}
            alt="Preview"
            className={cn(
              "rounded-lg border object-cover",
              isFullWidth ? "h-40 w-full" : "h-32 w-48",
            )}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 [border-radius:5px] bg-destructive p-0.5 text-destructive-foreground"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex flex-col items-center justify-center gap-2 [border-radius:5px] border-2 border-dashed bg-muted/50 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted disabled:cursor-wait disabled:opacity-60",
            isFullWidth ? "h-40 w-full" : "h-32 w-48",
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
          <span className="text-xs font-medium">{uploading ? "Uploading..." : placeholder}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium text-primary hover:underline"
        >
          Change image
        </button>
      ) : null}
    </div>
  );
}
