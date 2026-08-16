import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLms } from "@/lib/lms/store";
import { cn } from "@/lib/utils";

export function SiteHeader({ activeSection }: { activeSection?: string | undefined }) {
  const { currentUser } = useLms();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      scrollTo(id);
    } else {
      sessionStorage.setItem("landing.scrollTarget", id);
      navigate({ to: "/" });
    }
    setMobileMenuOpen(false);
  };

  const dashboardTo = currentUser?.role === "admin" ? "/admin/dashboard" : "/app/dashboard";

  const desktopNavClass = (isActive: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
      isActive ? "text-foreground" : "text-muted-foreground",
    );

  const mobileNavClass =
    "rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Hamza Visuals</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={desktopNavClass(activeSection === "home")}>
            Home
          </Link>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "services")}
            className={desktopNavClass(activeSection === "services")}
          >
            Services
          </a>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "courses")}
            className={desktopNavClass(activeSection === "courses")}
          >
            Courses
          </a>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "testimonials")}
            className={desktopNavClass(activeSection === "testimonials")}
          >
            Testimonials
          </a>
          <Link to="/resources" className={desktopNavClass(activeSection === "resources")}>
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {currentUser ? (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to={dashboardTo}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
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

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavClass}>
              Home
            </Link>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "services")}
              className={mobileNavClass}
            >
              Services
            </a>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "courses")}
              className={mobileNavClass}
            >
              Courses
            </a>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "testimonials")}
              className={mobileNavClass}
            >
              Testimonials
            </a>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavClass}
            >
              Resources
            </Link>
            <div className="my-2 border-t border-border" />
            {currentUser ? (
              <Button asChild variant="ghost" className="justify-start">
                <Link to={dashboardTo}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild className="justify-start">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
