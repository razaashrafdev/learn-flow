import type { LmsData } from "./types";
import { youtubeThumb } from "./youtube";

/**
 * DEMO / SEED DATA ONLY.
 * This file exists so the UI can be explored immediately. It is intentionally
 * kept separate from the store logic so it can be deleted when a real backend
 * is connected.
 */

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString();

type LessonSeed = [title: string, videoId: string, duration: string, description: string];

const courseBlueprints: {
  title: string;
  slug: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  instructor: string;
  short: string;
  description: string;
  status: "draft" | "published";
  cover: string;
  sections: { title: string; lessons: LessonSeed[] }[];
}[] = [
  {
    title: "Digital Marketing Masterclass",
    slug: "digital-marketing-masterclass",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "6h",
    instructor: "Amara Osei",
    short: "Learn the full digital marketing stack from strategy to execution.",
    description:
      "A practical, end-to-end walkthrough of modern digital marketing. You will build an audience profile, choose the right channels, plan campaigns and measure what actually moves the needle. No fluff, no theory for the sake of theory.",
    status: "published",
    cover: "nTPZ1zxT-hM",
    sections: [
      {
        title: "Introduction",
        lessons: [
          ["Introduction to Digital Marketing", "nTPZ1zxT-hM", "12 min", "What digital marketing really covers and how the pieces fit together."],
          ["Understanding Your Audience", "bixR-KIJKYM", "18 min", "Build a research-backed audience profile before spending a cent."],
          ["Digital Marketing Channels", "OGwtCPUdmpA", "21 min", "Owned, earned and paid channels compared."],
        ],
      },
      {
        title: "SEO Basics",
        lessons: [
          ["What is SEO?", "MYE6TumMPh0", "14 min", "How search engines rank pages, explained simply."],
          ["Keyword Research", "OgQqPRlPOsc", "23 min", "Find keywords with real intent and realistic difficulty."],
          ["On-Page SEO", "Ryd6dUJKMD8", "19 min", "Titles, structure, internal links and content depth."],
        ],
      },
      {
        title: "Campaigns & Measurement",
        lessons: [
          ["Building Your First Campaign", "GJRXQnPhKGE", "26 min", "From objective to creative to budget."],
          ["Reading The Numbers", "gAkwW2tuIqE", "17 min", "Which metrics matter, and which are vanity."],
        ],
      },
    ],
  },
  {
    title: "Modern Web Development with React",
    slug: "modern-web-development-with-react",
    category: "Web Development",
    level: "Intermediate",
    duration: "8h",
    instructor: "Daniel Reyes",
    short: "Build production-grade interfaces with React, TypeScript and modern tooling.",
    description:
      "Go beyond tutorials. This course covers component architecture, state management, data fetching patterns, accessibility and the deployment workflow professional teams actually use.",
    status: "published",
    cover: "Tn6-PIqc4UM",
    sections: [
      {
        title: "Getting Started",
        lessons: [
          ["React in 2026: The Landscape", "Tn6-PIqc4UM", "15 min", "Where React sits today and what changed."],
          ["Components and Props", "SqcY0GlETPk", "28 min", "The mental model that makes everything else easy."],
          ["State and Effects", "O6P86uwfdR0", "31 min", "When to reach for state, and when not to."],
        ],
      },
      {
        title: "TypeScript Essentials",
        lessons: [
          ["Why TypeScript", "zQnBQ4tB3ZA", "11 min", "The bugs it removes before you run the app."],
          ["Typing Components Properly", "ydkQlJhodio", "24 min", "Props, generics and inference in practice."],
        ],
      },
      {
        title: "Shipping",
        lessons: [
          ["Data Fetching Patterns", "novnyCaa7To", "22 min", "Loading, caching and error states done right."],
          ["Accessibility Basics", "z8xUCzToff8", "16 min", "Keyboard, focus and semantics."],
          ["Deploying Your App", "wo4vAOTgFN0", "13 min", "From local build to live URL."],
        ],
      },
    ],
  },
  {
    title: "Graphic Design Foundations",
    slug: "graphic-design-foundations",
    category: "Graphic Design",
    level: "Beginner",
    duration: "4h",
    instructor: "Lena Fischer",
    short: "Composition, colour and type — the fundamentals that make design work.",
    description:
      "Design is a craft with rules you can learn. This course walks through hierarchy, grid systems, colour theory and typography with real critiques of real work.",
    status: "published",
    cover: "YqQx75OPRa0",
    sections: [
      {
        title: "Seeing Like a Designer",
        lessons: [
          ["Principles of Composition", "YqQx75OPRa0", "17 min", "Balance, contrast, repetition and alignment."],
          ["Colour Theory in Practice", "_2LLXnUdUIc", "20 min", "Building palettes that hold up in real layouts."],
        ],
      },
      {
        title: "Typography",
        lessons: [
          ["Choosing Typefaces", "sByzHoiYFX0", "18 min", "Pairing, tone and legibility."],
          ["Type Hierarchy", "QrNi9FmdlxY", "15 min", "Guiding the eye through a page."],
          ["Layout and Grids", "aTFPOaOwwyE", "22 min", "Structure that scales across screens."],
        ],
      },
    ],
  },
  {
    title: "Freelancing From Zero to First Client",
    slug: "freelancing-zero-to-first-client",
    category: "Freelancing",
    level: "All Levels",
    duration: "3h",
    instructor: "Marcus Bell",
    short: "Positioning, pricing and pitching for independent professionals.",
    description:
      "A grounded guide to starting freelance work: how to position yourself, what to charge, where to find clients and how to write proposals that get replies.",
    status: "published",
    cover: "GjJTgL1Y2Uk",
    sections: [
      {
        title: "Setting Up",
        lessons: [
          ["Positioning Your Service", "GjJTgL1Y2Uk", "16 min", "Niche down without boxing yourself in."],
          ["Pricing Your Work", "cs8VXcU2p9Y", "21 min", "Hourly, project and value-based pricing compared."],
        ],
      },
      {
        title: "Finding Clients",
        lessons: [
          ["Where Clients Actually Are", "8jjbBLp7Cvo", "19 min", "Channels that work when you have no portfolio."],
          ["Writing Proposals That Convert", "Fdi7BSbNbUw", "24 min", "Structure, tone and follow-up."],
          ["Handling The First Call", "1Sr3wSyLnc0", "14 min", "Qualify, listen, and close calmly."],
        ],
      },
    ],
  },
  {
    title: "Business Fundamentals for Creators",
    slug: "business-fundamentals-for-creators",
    category: "Business",
    level: "Beginner",
    duration: "5h",
    instructor: "Priya Nandakumar",
    short: "The commercial side of creative work — offers, cashflow and growth.",
    description:
      "Draft course covering business models, unit economics, cashflow planning and sustainable growth for people who make things for a living.",
    status: "draft",
    cover: "SU8Q3G_LWzc",
    sections: [
      {
        title: "Business Models",
        lessons: [
          ["Products vs Services", "SU8Q3G_LWzc", "18 min", "Trade-offs in time, scale and risk."],
          ["Designing Your Offer", "Th8JoIan4dg", "20 min", "Packaging work so it sells itself."],
        ],
      },
      {
        title: "Money",
        lessons: [
          ["Cashflow Basics", "Fj9GG1yAv94", "17 min", "Runway, invoicing and buffers."],
          ["Simple Unit Economics", "Xk8xNMGGdTU", "19 min", "Knowing what each sale really earns."],
        ],
      },
    ],
  },
];

export function buildSeed(): LmsData {
  const categoryNames = [
    ["Web Development", "Frontend, backend and everything in between."],
    ["Digital Marketing", "Growth, channels, campaigns and analytics."],
    ["Graphic Design", "Visual craft, layout, colour and type."],
    ["Business", "Strategy, operations and commercial skills."],
    ["Freelancing", "Working independently and sustainably."],
    ["SEO", "Organic search, content and technical optimisation."],
  ];

  const categories = categoryNames.map(([name, description], i) => ({
    id: `cat-${i + 1}`,
    name: name!,
    description: description!,
    createdAt: iso(120 - i),
  }));

  const users: LmsData["users"] = [
    {
      id: "user-admin",
      name: "Sofia Marquez",
      email: "admin@lms.dev",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: iso(200),
    },
    ...[
      "Jonah Whitfield",
      "Amelie Dubois",
      "Ravi Shankar",
      "Nora Lindqvist",
      "Tomas Varga",
      "Sofia Martinez",
      "Liam O'Connor",
      "Yuki Tanaka",
      "Emma Wilson",
      "Carlos Reyes",
      "Zara Ahmed",
      "Kofi Mensah",
      "Ines Ferreira",
      "Arjun Patel",
      "Mila Novak",
    ].map((name, i) => ({
      id: `user-student-${i + 1}`,
      name,
      email: `${name.split(" ")[0]!.toLowerCase()}@student.dev`,
      password: "student123",
      role: "student" as const,
      active: i !== 4,
      createdAt: iso(60 - i * 7),
    })),
  ];

  const courses: LmsData["courses"] = [];
  const sections: LmsData["sections"] = [];
  const lessons: LmsData["lessons"] = [];

  courseBlueprints.forEach((bp, ci) => {
    const courseId = `course-${ci + 1}`;
    courses.push({
      id: courseId,
      title: bp.title,
      slug: bp.slug,
      shortDescription: bp.short,
      description: bp.description,
      thumbnail: youtubeThumb(bp.cover),
      categoryId: categories.find((c) => c.name === bp.category)!.id,
      level: bp.level,
      duration: bp.duration,
      instructor: bp.instructor,
      status: bp.status,
      createdAt: iso(90 - ci * 9),
      updatedAt: iso(5 + ci),
    });

    bp.sections.forEach((sec, si) => {
      const sectionId = `${courseId}-sec-${si + 1}`;
      sections.push({ id: sectionId, courseId, title: sec.title, order: si });
      sec.lessons.forEach((l, li) => {
        lessons.push({
          id: `${sectionId}-les-${li + 1}`,
          sectionId,
          title: l[0],
          youtubeVideoId: l[1],
          youtubeUrl: `https://www.youtube.com/watch?v=${l[1]}`,
          duration: l[2],
          description: l[3],
          order: li,
          freePreview: si === 0 && li === 0,
          published: true,
        });
      });
    });
  });

  const lessonsOf = (courseId: string) =>
    sections
      .filter((s) => s.courseId === courseId)
      .sort((a, b) => a.order - b.order)
      .flatMap((s) => lessons.filter((l) => l.sectionId === s.id).sort((a, b) => a.order - b.order));

  const enrollments: LmsData["enrollments"] = [];
  const progress: LmsData["progress"] = [];

  const plan: [studentIdx: number, courseIdx: number, completedCount: number][] = [
    [1, 1, 5],
    [1, 2, 9],
    [1, 3, 2],
    [2, 1, 8],
    [2, 3, 0],
    [3, 2, 3],
    [3, 4, 5],
    [4, 1, 1],
    [11, 1, 3],
    [11, 2, 6],
    [12, 3, 4],
    [12, 5, 2],
    [13, 1, 7],
    [13, 4, 1],
    [14, 2, 5],
    [14, 3, 3],
    [15, 5, 4],
    [15, 1, 2],
  ];

  plan.forEach(([sIdx, cIdx, done], i) => {
    const studentId = `user-student-${sIdx}`;
    const courseId = `course-${cIdx}`;
    const all = lessonsOf(courseId);
    const completedLessons = all.slice(0, done);
    const isComplete = done >= all.length && all.length > 0;
    enrollments.push({
      id: `enr-${i + 1}`,
      studentId,
      courseId,
      status: isComplete ? "completed" : "in_progress",
      enrolledAt: iso(45 - i * 4),
      completedAt: isComplete ? iso(3) : null,
      lastLessonId: (completedLessons[completedLessons.length - 1]?.id ?? all[0]?.id) ?? null,
      lastAccessedAt: iso(i + 1),
    });
    completedLessons.forEach((l, li) => {
      progress.push({
        id: `prog-${i + 1}-${li + 1}`,
        studentId,
        courseId,
        lessonId: l.id,
        completed: true,
        completedAt: iso(20 - li),
      });
    });
  });

  return { users, categories, courses, sections, lessons, enrollments, progress };
}
