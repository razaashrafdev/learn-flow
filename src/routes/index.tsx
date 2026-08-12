import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GraduationCap,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  Menu,
  X,
  Palette,
  Brush,
  Layers,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLms, useSelectors } from "@/lib/lms/store";
import { LandingCourseCard } from "@/components/lms/course-card";
import { PublicFooter } from "@/components/lms/ui-bits";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hamza Visuals LMS — Learn at Your Own Pace" },
      {
        name: "description",
        content:
          "Hamza Visuals LMS is a simple, modern learning platform for course creators and students, with YouTube-based lessons and automatic progress tracking.",
      },
      { property: "og:title", content: "Hamza Visuals LMS — Learn at Your Own Pace" },
      {
        property: "og:description",
        content: "A simple, modern learning platform with video lessons and progress tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const WHATSAPP_URL = "https://wa.me/923001234567";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered interfaces that delight users and drive business results.",
  },
  {
    icon: Brush,
    title: "Logo Design",
    description: "Memorable brand marks that capture your essence and stand the test of time.",
  },
  {
    icon: Layers,
    title: "Branding",
    description: "Complete brand systems that tell your story across every touchpoint.",
  },
  {
    icon: BrainCircuit,
    title: "AI Integration",
    description: "Intelligent features powered by the latest AI and machine learning technologies.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Professional",
    content: "Hamza Visuals LMS transformed how I learn digital marketing. The video quality is excellent and the progress tracking keeps me motivated.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Web Developer",
    content: "The React course helped me land my first developer job. The structured curriculum and hands-on projects made all the difference.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    content: "I love how simple and clean the platform is. No distractions, just quality content that has helped me grow my design skills and build a stronger portfolio.",
    rating: 5,
  },
];

const stats = [
  { label: "Active Students", value: "1,500+" },
  { label: "Courses Available", value: "10+" },
  { label: "Video Lessons", value: "100+" },
  { label: "Completion Rate", value: "94%" },
];

function LandingPage() {
  const { data, currentUser, ready } = useLms();
  const s = useSelectors();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publishedCourses = useMemo(
    () => data.courses.filter((c) => c.status === "published"),
    [data.courses],
  );

  const landingCourses = useMemo(() => {
    return publishedCourses.slice(0, 6);
  }, [publishedCourses]);

  const handleCourseClick = (courseId: string) => {
    navigate({ to: "/courses/$courseId", params: { courseId } });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <button
              onClick={() => scrollTo("home")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo("courses")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Courses
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollTo("cta")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {currentUser ? (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to={currentUser.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}>
                  Dashboard
                </Link>
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
              <button
                onClick={() => { scrollTo("home"); setMobileMenuOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Home
              </button>
              <button
                onClick={() => { scrollTo("services"); setMobileMenuOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Services
              </button>
              <button
                onClick={() => { scrollTo("courses"); setMobileMenuOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Courses
              </button>
              <button
                onClick={() => { scrollTo("testimonials"); setMobileMenuOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Testimonials
              </button>
              <button
                onClick={() => { scrollTo("cta"); setMobileMenuOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Contact
              </button>
              <div className="my-2 border-t border-border" />
              {currentUser ? (
                <Button asChild variant="ghost" className="justify-start">
                  <Link to={currentUser.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}>
                    Dashboard
                  </Link>
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

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.03] [background:radial-gradient(80%_50%_at_50%_-20%,var(--color-primary),transparent)] dark:opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Trusted by 1,500+ learners Globaly
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Master New Skills
              <br />
              <span className="text-primary">At Your Own Pace</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              A modern learning platform with expert-led video courses, progress tracking,
              and a clean interface designed to help you achieve your goals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link to="/courses">
                  Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">LMS Portal</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-primary sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything You Need to Grow
            </h2>
            <p className="mt-4 text-muted-foreground">
              From design to development, we deliver end-to-end digital solutions 
              that help businesses scale and succeed in the modern world.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Popular Courses
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Learn From the Best
              </h2>
              <p className="mt-3 text-muted-foreground">
                Start learning today with our expert-led courses.
              </p>
            </div>
          </div>

          {!ready ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-surface animate-pulse overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: 3 courses */}
              <div className="mt-10 grid gap-6 sm:hidden">
                {landingCourses.slice(0, 3).map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                      onClick={() => handleCourseClick(course.id)}
                    />
                  );
                })}
              </div>
              {/* Tablet: 3 courses */}
              <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-3 lg:hidden">
                {landingCourses.slice(0, 3).map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                      onClick={() => handleCourseClick(course.id)}
                    />
                  );
                })}
              </div>
              {/* Desktop: 3 courses */}
              <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
                {landingCourses.slice(0, 3).map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                      onClick={() => handleCourseClick(course.id)}
                    />
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of learners who have transformed their careers.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card-surface p-6 transition-shadow hover:shadow-lg">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  "{testimonial.content}"
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join our community of learners and start your journey today. Free courses available to get you started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <div className="group relative card-surface p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <service.icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-base font-bold">{service.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Learn more <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}
