import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Facebook,
  Instagram,
  Layers,
  Linkedin,
  MessageCircle,
  Palette,
  Rocket,
  Share2,
  Sparkles,
  Target,
  Users,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeInSection, PublicFooter } from "@/components/lms/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Instructor — Hamza Visuals LMS" },
      {
        name: "description",
        content:
          "Meet the instructor behind Hamza Visuals LMS. Learn about the teaching philosophy, expertise, and community.",
      },
      { property: "og:title", content: "About Instructor — Hamza Visuals LMS" },
      {
        property: "og:description",
        content:
          "Meet the instructor behind Hamza Visuals LMS. Learn about the teaching philosophy, expertise, and community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutInstructorPage,
});

/* ─── Data ─── */
const stats = [
  { label: "Students Taught", value: "2,500+", icon: Users },
  { label: "Years Experience", value: "5+", icon: Layers },
  { label: "Projects Completed", value: "113+", icon: Rocket },
  { label: "Followers", value: "7,000+", icon: MessageCircle },
];

const expertise = [
  { label: "Brand Design", icon: Palette },
  { label: "Creative Calligraphy", icon: Target },
  { label: "Generative AI", icon: Sparkles },
  { label: "UGC Ads Creation", icon: Share2 },
];

const journey = [
  {
    year: "2018",
    title: "Started the Journey",
    desc: "Began exploring graphic design and visual storytelling, building a foundation in creative tools and principles.",
  },
  {
    year: "2019",
    title: "Professional Freelancing",
    desc: "Started taking on client projects across branding, social media design, and visual content creation.",
  },
  {
    year: "2021",
    title: "Content Creator Era",
    desc: "Launched educational content on YouTube and social platforms, teaching design and creative workflows.",
  },
  {
    year: "2023",
    title: "Built the Community",
    desc: "Created a thriving community of learners and creators, mentoring students through practical projects.",
  },
  {
    year: "2024",
    title: "Hamza Visuals LMS",
    desc: "Launched a structured learning platform to deliver project-based courses with hands-on experience.",
  },
];

const WHATSAPP_URL = "https://wa.me/923308923780";

/* ─── Social Links ─── */
const socialLinks = [
  { icon: <Facebook className="h-4 w-4" />, href: "https://www.facebook.com/hamzavisuals1", label: "Facebook" },
  { icon: <Instagram className="h-4 w-4" />, href: "https://www.instagram.com/hamza.visuals1/", label: "Instagram" },
  { icon: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
    </svg>
  ), href: "https://www.threads.com/@hamza.visuals1", label: "Threads" },
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ), href: "https://www.pinterest.com/hamzavisuals1/", label: "Pinterest" },
  { icon: <Youtube className="h-4 w-4" />, href: "https://www.youtube.com/@Hamza.Visuals1", label: "YouTube" },
  { icon: <Linkedin className="h-4 w-4" />, href: "#", label: "LinkedIn" },
];

/* ─── Page ─── */
function AboutInstructorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden bg-background pb-16 pt-20 sm:pb-24 sm:pt-28">
        {/* Layered background surfaces */}
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0 opacity-[0.04] [background:radial-gradient(80%_50%_at_50%_-20%,var(--color-primary),transparent)] dark:opacity-[0.06]" />
        <div className="absolute inset-0 [background:radial-gradient(100%_100%_at_50%_0%,transparent_30%,var(--color-background)_100%)] dark:[background:radial-gradient(100%_100%_at_50%_0%,transparent_20%,var(--color-background)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Left — Text */}
            <FadeInSection className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 [border-radius:5px] border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
                <Users className="h-3.5 w-3.5" />
                Instructor Intro
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                Hamza Bhatti
              </h1>

              <p className="mt-3 text-lg font-semibold text-primary">
                Creative Brand Designer
              </p>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:max-w-lg">
                Helping students master design, branding, and AI-powered creative workflows through
                practical, project-based learning. Built on real experience, designed for real
                results.
              </p>

              {/* Social Row */}
              <div className="mt-6 flex items-center gap-3 justify-center lg:justify-start">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center [border-radius:5px] border border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button asChild size="lg">
                  <Link to="/courses" target="_blank" rel="noopener noreferrer">
                    Explore Courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://wa.me/9233308923780">Contact Me</a>
                </Button>
              </div>
            </FadeInSection>

            {/* Right — Profile Image */}
            <FadeInSection delay={150} className="flex-shrink-0">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-lg" />
                <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card">
                  <div className="flex h-[320px] w-[280px] items-center justify-center bg-gradient-to-br from-primary/8 to-primary/3 sm:h-[380px] sm:w-[320px]">
                    <img
                      src="/images/favicon.PNG"
                      alt="Hamza Bhatti"
                      className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover sm:h-36 sm:w-36"
                    />
                  </div>
                  {/* Bottom bar */}
                  <div className="border-t border-border bg-card px-5 py-3 text-center">
                    <p className="text-sm font-bold text-foreground">Hamza Visuals</p>
                    <p className="text-xs text-muted-foreground">Educator &amp; Designer</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ════════════════════ EXPERTISE ════════════════════ */}
      <section className="border-y border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Areas of Expertise
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                A diverse skill set spanning creative design, technology, and education.
              </p>
            </div>
          </FadeInSection>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {expertise.map((e, i) => (
              <FadeInSection key={e.label} delay={i * 50}>
                <div className="card-surface group flex items-center gap-3 px-4 py-4 transition-all hover:border-primary/30 hover:shadow-md">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <e.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{e.label}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ ABOUT ════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  About the Instructor
                </h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-primary" />

                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  Hamza Bhatti is a passionate graphic designer, brand strategist, and creative
                  educator with over five years of hands-on experience in the design industry. From
                  crafting brand identities to producing AI-powered visual content, Hamza has worked
                  across a wide range of creative disciplines.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  After years of freelancing and building brands for clients worldwide, Hamza turned
                  toward education — driven by a belief that practical, project-based learning is
                  the fastest path to mastery. The Hamza Visuals LMS was built on that belief: a
                  platform where every course leads to a real, portfolio-worthy project.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Whether it&apos;s graphic design, video editing, AI tools, or creative
                  entrepreneurship, Hamza&apos;s approach is rooted in clarity, relevance, and
                  hands-on building. The goal is simple: help students develop skills that translate
                  directly to real-world work.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-3">
                  {stats.map((s, i) => (
                    <FadeInSection key={s.label} delay={i * 80}>
                      <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <s.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                          <p className="text-sm text-muted-foreground">{s.label}</p>
                        </div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ════════════════════ JOURNEY ════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                The Journey
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                From a curious beginner to a professional educator and community builder.
              </p>
            </div>
          </FadeInSection>

          <div className="relative mt-12">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 hidden w-0.5 bg-border sm:left-1/2 sm:block sm:-translate-x-px" />

            <div className="space-y-8">
              {journey.map((j, i) => (
                <FadeInSection key={j.year} delay={i * 100}>
                  <div
                    className={cn(
                      "relative flex flex-col gap-4 sm:flex-row sm:items-center",
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
                    )}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary bg-secondary sm:left-1/2 sm:block sm:z-10" />

                    {/* Connector line from dot to card */}
                    <div
                      className={cn(
                        "absolute top-1/2 hidden h-0.5 -translate-y-1/2 bg-border sm:block sm:z-0",
                        i % 2 === 0
                          ? "right-1/2 w-12"
                          : "left-1/2 w-12",
                      )}
                    />

                    {/* Content */}
                    <div
                      className={cn(
                        "ml-10 flex-1 sm:ml-0",
                        i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12",
                      )}
                    >
                      <div
                        className={cn(
                          "card-surface relative z-10 inline-block px-5 py-4 transition-all hover:shadow-md",
                          "sm:max-w-md",
                        )}
                      >
                        <span className="inline-block [border-radius:5px] bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {j.year}
                        </span>
                        <h3 className="mt-2 text-base font-bold text-foreground">{j.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {j.desc}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for other side */}
                    <div className="hidden flex-1 sm:block" />
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA Section ════════════════════ */}
      <section id="cta" className="relative overflow-hidden [border-radius:15px] border border-border bg-primary dark:bg-gradient-to-br dark:from-[#0C0C0C] dark:via-[#0a1a2e] dark:to-[#0C0C0C] mx-4 sm:mx-6 lg:mx-8 my-16 sm:my-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-44 h-[28rem] w-[28rem] rounded-full bg-primary-foreground/10 blur-3xl dark:bg-[rgba(0,118,223,0.25)]" />
          <div className="absolute -bottom-48 -left-28 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl dark:bg-[rgba(0,118,223,0.15)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-12%,rgba(255,255,255,0.06),transparent_62%)] dark:bg-[radial-gradient(120%_60%_at_50%_-12%,rgba(0,118,223,0.2),transparent_62%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground dark:text-white sm:text-4xl">
            Start Where You're Comfortable
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/70 dark:text-white/70">
            Explore the full course library, or start with a free course to experience my teaching
            style and see what works best for you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Get Started Free</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="dark:border-white/25 dark:text-white">
              <Link to="/courses" target="_blank" rel="noopener noreferrer">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
