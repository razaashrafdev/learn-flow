import { Link } from "@tanstack/react-router";
import { GraduationCap, ChevronLeft, Menu, X, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
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
    active: "bg-success/12 text-success",
    disabled: "bg-destructive/10 text-destructive",
  };
  const label = status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
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
        Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of {totalItems}
      </p>
      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          <span className="sm:hidden">&lt;</span><span className="hidden sm:inline">Prev</span>
        </Button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
          let p: number;
          if (totalPages <= 3) { p = i + 1; }
          else if (page <= 2) { p = i + 1; }
          else if (page >= totalPages - 1) { p = totalPages - 2 + i; }
          else { p = page - 1 + i; }
          return (
            <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(() => p)}>{p}</Button>
          );
        })}
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
          <span className="sm:hidden">&gt;</span><span className="hidden sm:inline">Next</span>
        </Button>
      </div>
    </div>
  );
}

export function PublicHeader({ activeSection, hideNav }: { activeSection?: string; hideNav?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>
        </Link>

        {!hideNav && (
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground", activeSection === "home" ? "text-foreground" : "text-muted-foreground")}>
              Home
            </Link>
            <a href="/#services" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground", activeSection === "services" ? "text-foreground" : "text-muted-foreground")}>
              Services
            </a>
            <Link to="/courses" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground", activeSection === "courses" ? "text-foreground" : "text-muted-foreground")}>
              Courses
            </Link>
            <a href="/#testimonials" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground", activeSection === "testimonials" ? "text-foreground" : "text-muted-foreground")}>
              Testimonials
            </a>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/register">Get Started</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {!hideNav && mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Home
            </Link>
            <a href="/#services" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Services
            </a>
            <Link to="/courses" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Courses
            </Link>
            <a href="/#testimonials" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Testimonials
            </a>
            <div className="my-2 border-t border-border" />
            <Button asChild className="justify-start">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link to="/login">Sign In</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-surface border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-foreground">Hamza Visuals</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A modern learning platform designed to help you achieve your goals.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Explore</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link></li>
              <li><a href="/#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Services</a></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hamza Visuals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
