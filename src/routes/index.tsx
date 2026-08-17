import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronRight, Star, Palette, Brush, ArrowRight, ChevronLeft, Camera, ShoppingBag, Video, Lightbulb, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLms, useSelectors } from "@/lib/lms/store";
import { LandingCourseCard } from "@/components/lms/course-card";
import { PublicFooter } from "@/components/lms/ui-bits";

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

const WHATSAPP_URL = "https://wa.me/923308923780";

const services = [
  {
    icon: Palette,
    title: "Graphic Designing",
    description: "Create stunning visuals that capture attention and communicate your message.",
  },
  {
    icon: Brush,
    title: "Branding",
    description: "Build a powerful brand identity that stands out and resonates with your audience.",
  },
  {
    icon: Camera,
    title: "AI Photography",
    description: "Leverage AI to create professional-quality photographs and product imagery.",
  },
  {
    icon: ShoppingBag,
    title: "Ecommerce Photography",
    description: "Specialized product photography that drives sales and elevates your online store.",
  },
  {
    icon: Video,
    title: "UGC Ads",
    description: "Create authentic user-generated content ads that convert and build trust.",
  },
  {
    icon: Video,
    title: "AI Videos",
    description: "Produce engaging video content using cutting-edge AI tools and techniques.",
  },
  {
    icon: Lightbulb,
    title: "AI Powered Designs",
    description: "Harness the power of AI to create innovative and eye-catching designs.",
  },
  {
    icon: GraduationCap,
    title: "Mentorship",
    description: "Get personalized guidance from industry experts to accelerate your creative career.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Amna Zafar",
    role: "Graphic Designer",
    content:
      "I struggled with writing effective prompts and getting the results I wanted from AI. This session taught me product photography, professional mockups, and better prompting techniques. I'd definitely recommend it to anyone wanting to use AI more effectively.",
    rating: 5,
    image: "/testimonials/1.png",
  },
  {
    id: 2,
    name: "Noureen Hassan",
    role: "Graphic Designer",
    content:
      "Before this session, I struggled to use AI tools effectively and write the right prompts. After learning the techniques and using the prompt packs, everything became clearer and more productive. I'd definitely recommend this session anyone wanting better AI results.",
    rating: 5,
    image: "/testimonials/2.png",
  },
  {
    id: 3,
    name: "Memoona Talpur",
    role: "Brand Designer",
    content:
      "Before this session, I experimented with AI for logo and brand design but struggled with consistent results. After Sir Hamza Bhatti's course, I learned how to structure prompts and guide AI properly. It gave me the clarity and system to use AI effectively in design.",
    rating: 5,
    image: "/testimonials/3.png",
  },
  {
    id: 4,
    name: "Hamza Azeem",
    role: "Logo Designer",
    content:
      "I only knew the basics of AI tools, and my results were mostly random. I learned advanced techniques like structured prompts, image manipulation, and creating strong brand presentations with AI. It taught me how to guide AI properly and create much better visuals for professional design projects.",
    rating: 5,
    image: "/testimonials/4.png",
  },
  {
    id: 5,
    name: "Hafeez Shaikh",
    role: "Graphic Designer",
    content:
      "I used to rely on random prompts and hope AI would understand what I meant. This session taught me that effective prompting is about structure and control. The framework completely changed my approach and now I get more consistent, high-quality results.",
    rating: 5,
    image: "/testimonials/5.png",
  },
  {
    id: 6,
    name: "Samreen Yaseen",
    role: "Brand Designer",
    content:
      "I had very little understanding of AI prompting and image generation. I didn't know how to structure prompts for better results. I learned prompt writing, camera angles, and detailed descriptions. It completely changed my approach, and now I can create better images and use AI more effectively.",
    rating: 5,
    image: "/testimonials/6.png",
  },
  {
    id: 7,
    name: "Imran Khan",
    role: "Visual Designer",
    content:
      "The session taught me the foundations of prompting, image prompts, and new AI tools. Since then, I've been using ReveAI, Whisk AI, ImageFX, and Nano Banana to improve my social media designs, mockups, logos, and branding. Sir Hamza guidance made graphic design much easier.",
    rating: 5,
    image: "/testimonials/7.png",
  },
  {
    id: 8,
    name: "Seerat Yousaf",
    role: "Graphic Designer",
    content:
      "I've used many AI models before but was still confused about advanced prompting. I was mostly replacing things in images, I started creating images from scratch with much better control. I even applied what I learned to my job project, and it made a huge difference in the final results.",
    rating: 5,
    image: "/testimonials/8.png",
  },
  {
    id: 9,
    name: "Muhammad Wajid",
    role: "Brand Designer",
    content:
      "I used to generate AI images but didn't understand the fundamentals behind them. I had no idea about camera angles, prompt structure, or how to clearly communicate with AI. After this course, everything became clear. I learned how to create better images with more control.",
    rating: 5,
    image: "/testimonials/9.png",
  },
  {
    id: 10,
    name: "Mehrub Fayyaz",
    role: "Graphic Designer",
    content:
      "Before this session, my prompts felt like guesswork. After learning the system behind prompting, I finally understood how to guide AI instead of hoping for the best. The session gave me clarity, confidence, and much better results. If you're considering it, I'd definitely recommend it.",
    rating: 5,
    image: "/testimonials/10.png",
  },
  {
    id: 11,
    name: "Bint E Adam",
    role: "Graphic Designer",
    content:
      "I often struggled to get the right responses from ChatGPT. After learning prompt engineering, everything changed. I now know how to write clear, targeted prompts that give precise answers. The sessions are engaging and practical, and have completely improved how I use AI in my daily work.",
    rating: 5,
    image: "/testimonials/11.png",
  },
];

const faqs = [
  {
    question: "Are the courses suitable for beginners?",
    answer:
      "Yes. Most courses start from the basics and build up, with simple, jargon-free explanations.",
  },
  {
    question: "What language are the courses taught in?",
    answer: "All courses are taught in Urdu, with clear, step-by-step explanations.",
  },
  {
    question: "How long will I have access to a course?",
    answer:
      "Applicable premium courses include lifetime access, so you can revisit lessons whenever you need to.",
  },
  {
    question: "Are there free courses available?",
    answer:
      "Yes. CapCut, Canva, Basics of AI Image Generation, and Master ChatGPT are all free — a good way to try the teaching style before enrolling in a premium course.",
  },
  {
    question: "Do I get downloadable resources with my courses?",
    answer:
      "Most courses include downloadable resources such as templates, prompt packs, or project files you can reuse.",
  },
  {
    question: "How do the monthly Q&A sessions work?",
    answer:
      "Enrolled students can join live monthly Q&A sessions to ask questions directly and get help with real projects.",
  },
  {
    question: "Can these skills actually help with freelancing or professional work?",
    answer:
      "The courses are built around practical, real-world workflows, and many past students have gone on to take freelance projects, work with clients, or apply these skills in their jobs. Results depend on effort and how the skills are applied.",
  },
  {
    question: "How do I access my courses after enrolling?",
    answer:
      "Once you enroll, your courses, downloads, and progress are all available inside your student dashboard.",
  },
];

const stats = [
  { label: "Students Trained", value: "1000+" },
  { label: "Years of Experience", value: "05+" },
  { label: "Video Lessons", value: "100+" },
  { label: "Completion Rate", value: "94%" },
];

function LandingPage() {
  const { data, ready } = useLms();
  const s = useSelectors();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const maxSlide = Math.max(0, testimonials.length - slidesPerView);

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, [slidesPerView]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(maxSlide, prev + 1));
  }, [maxSlide]);

  const publishedCourses = useMemo(
    () => data.courses.filter((c) => c.status === "published"),
    [data.courses],
  );

  const landingCourses = useMemo(() => {
    return [...publishedCourses]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 3);
  }, [publishedCourses]);

  useEffect(() => {
    const target = sessionStorage.getItem("landing.scrollTarget");
    if (target) {
      sessionStorage.removeItem("landing.scrollTarget");
      requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.03] [background:radial-gradient(80%_50%_at_50%_-20%,var(--color-primary),transparent)] dark:opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Trained 1000+ Students in Design and AI
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              AI Skills That Work in <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent blur-[0.5px]">the Real World</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Hamza Visuals teaches graphic design, video editing, and practical AI through hands-on courses. Learn through real projects and apply knowledge right away.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link to="/courses">
                  Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/app/my-courses">My Learning</Link>
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
              From design to development, we deliver end-to-end digital solutions that help
              businesses scale and succeed in the modern world.
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
              {/* Mobile: all courses */}
              <div className="mt-10 grid gap-6 sm:hidden">
                {landingCourses.map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                    />
                  );
                })}
              </div>
              {/* Tablet: all courses */}
              <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:hidden">
                {landingCourses.map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                    />
                  );
                })}
              </div>
              {/* Desktop: all courses */}
              <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
                {landingCourses.map((course) => {
                  const lessonCount = s.publishedLessonsOfCourse(course.id).length;
                  return (
                    <LandingCourseCard
                      key={course.id}
                      course={course}
                      lessonCount={lessonCount}
                    />
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <Button asChild className="bg-blue-600 text-white shadow hover:bg-blue-700">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our Students Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of learners who have transformed their careers.
            </p>
          </div>

          <div className="relative mx-auto mt-14 max-w-7xl">
            {/* Slider Buttons */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed sm:-left-5 sm:h-12 sm:w-12"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Slider Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                  >
                    <div className="card-surface p-6 transition-shadow hover:shadow-lg h-full">
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {testimonial.content}
                      </p>
                      <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        <div className="hidden flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide >= maxSlide}
              className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed sm:-right-5 sm:h-12 sm:w-12"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about learning on our platform.
            </p>
          </div>

          <Accordion type="single" collapsible className="mx-auto mt-12 max-w-3xl">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question} className="px-2 sm:px-0">
                <AccordionTrigger className="text-base sm:text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative overflow-hidden rounded-3xl border border-border bg-primary dark:bg-gradient-to-br dark:from-[#0C0C0C] dark:via-[#0a1a2e] dark:to-[#0C0C0C] mx-4 sm:mx-6 lg:mx-8 my-16 sm:my-20">
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
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
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
        Explore More <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}
