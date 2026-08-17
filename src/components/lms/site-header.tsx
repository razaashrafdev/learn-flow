import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLms } from "@/lib/lms/store";
import { cn } from "@/lib/utils";

export function SiteHeader({ activeSection }: { activeSection?: string | undefined }) {
  const { currentUser } = useLms();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  const pathname = location.pathname;

  useEffect(() => {
    if (pathname !== "/") {
      setCurrentSection("");
      return;
    }

    const sections = ["home", "services", "courses", "testimonials", "faq"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const getActiveState = (section: string, path?: string) => {
    if (path) {
      return pathname === path;
    }
    if (pathname !== "/") return false;
    return currentSection === section;
  };

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
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  const mobileNavClass = (isActive: boolean) =>
    cn(
      "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
      isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={desktopNavClass(getActiveState("home"))}>
            Home
          </Link>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "services")}
            className={desktopNavClass(getActiveState("services"))}
          >
            Services
          </a>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "courses")}
            className={desktopNavClass(getActiveState("courses"))}
          >
            Courses
          </a>
          <a
            href="/"
            onClick={(e) => handleSectionClick(e, "testimonials")}
            className={desktopNavClass(getActiveState("testimonials"))}
          >
            Testimonials
          </a>
          <Link to="/resources" className={desktopNavClass(getActiveState("resources", "/resources"))}>
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
                <a href="https://wa.me/923308923780" target="_blank" rel="noopener noreferrer">Mentorship</a>
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
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavClass(getActiveState("home"))}>
              Home
            </Link>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "services")}
              className={mobileNavClass(getActiveState("services"))}
            >
              Services
            </a>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "courses")}
              className={mobileNavClass(getActiveState("courses"))}
            >
              Courses
            </a>
            <a
              href="/"
              onClick={(e) => handleSectionClick(e, "testimonials")}
              className={mobileNavClass(getActiveState("testimonials"))}
            >
              Testimonials
            </a>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavClass(getActiveState("resources", "/resources"))}
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
                <Button asChild variant="ghost" className="justify-start">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="justify-start">
                  <a href="https://wa.me/923308923780" target="_blank" rel="noopener noreferrer">Mentorship</a>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
