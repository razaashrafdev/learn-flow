import type { CourseLevel, LmsData } from "./types";
import { youtubeThumb, youtubeEmbed } from "./youtube";

/**
 * DEMO / SEED DATA ONLY.
 * This file exists so the UI can be explored immediately. It is intentionally
 * kept separate from the store logic so it can be deleted when a real backend
 * is connected.
 */

const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

type LessonSeed = [title: string, videoId: string, duration: string, description: string];

type ReviewSeed = {
  author: string;
  role: string;
  rating: number;
  content: string;
};

type CourseBlueprint = {
  title: string;
  slug: string;
  category: string;
  level: CourseLevel;
  pricingType: "free" | "paid";
  duration: string;
  instructor: string;
  short: string;
  description: string;
  status: "draft" | "published";
  cover: string;
  language: string;
  mode: string;
  accessPeriod: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  price?: number;
  originalPrice?: number;
  learningOutcomes: string[];
  requirements: string[];
  reviews: ReviewSeed[];
  instructorProfile: {
    role: string;
    bio: string;
    rating: number;
    students: number;
    courses: number;
  };
  sections: { title: string; lessons: LessonSeed[] }[];
};

const courseBlueprints: CourseBlueprint[] = [
  {
    title: "Digital Marketing Masterclass",
    slug: "digital-marketing-masterclass",
    category: "Digital Marketing",
    level: "Beginner",
    pricingType: "free",
    duration: "6h",
    instructor: "Hamza Bhatti",
    short: "Learn the full digital marketing stack from strategy to execution.",
    description:
      "A practical, end-to-end walkthrough of modern digital marketing. You will build an audience profile, choose the right channels, plan campaigns and measure what actually moves the needle. No fluff, no theory for the sake of theory.",
    status: "published",
    cover: "nTPZ1zxT-hM",
    language: "English",
    mode: "Online",
    accessPeriod: "6 months access",
    rating: 4.8,
    reviewCount: 2417,
    studentCount: 12480,
    learningOutcomes: [
      "Build a research-backed audience profile before spending a cent",
      "Plan full-funnel campaigns across owned, earned and paid channels",
      "Run keyword research and write content that ranks on search",
      "Launch your first digital campaign from brief to budget",
      "Read the analytics that actually move the needle",
      "Set up a repeatable content and channel strategy",
    ],
    requirements: [
      "No prior marketing experience required",
      "A computer with an internet connection",
      "A notebook and a hands-on attitude",
    ],
    reviews: [
      {
        author: "Jordan Akintola",
        role: "Marketing Coordinator",
        rating: 5,
        content:
          "Hamza makes strategy feel approachable — I launched my first real campaign in week two.",
      },
      {
        author: "Priya Sharma",
        role: "Small Business Owner",
        rating: 5,
        content:
          "Exactly what busy owners need. The channel deep-dives saved me weeks of guessing.",
      },
      {
        author: "Tomas Rivera",
        role: "Content Writer",
        rating: 4,
        content: "Clear, practical and well-paced. The SEO module alone is worth the time.",
      },
    ],
    instructorProfile: {
      role: "Course Instructor",
      bio: "Hamza has spent the last decade planning campaigns for startups and growing teams. He teaches strategy the way it is actually run — with clear questions, honest numbers and a bias for action.",
      rating: 4.9,
      students: 12480,
      courses: 6,
    },
    sections: [
      {
        title: "Introduction",
        lessons: [
          [
            "Introduction to Digital Marketing",
            "nTPZ1zxT-hM",
            "12 min",
            "What digital marketing really covers and how the pieces fit together.",
          ],
          [
            "Understanding Your Audience",
            "bixR-KIJKYM",
            "18 min",
            "Build a research-backed audience profile before spending a cent.",
          ],
          [
            "Digital Marketing Channels",
            "OGwtCPUdmpA",
            "21 min",
            "Owned, earned and paid channels compared.",
          ],
        ],
      },
      {
        title: "SEO Basics",
        lessons: [
          [
            "What is SEO?",
            "MYE6TumMPh0",
            "14 min",
            "How search engines rank pages, explained simply.",
          ],
          [
            "Keyword Research",
            "OgQqPRlPOsc",
            "23 min",
            "Find keywords with real intent and realistic difficulty.",
          ],
          [
            "On-Page SEO",
            "Ryd6dUJKMD8",
            "19 min",
            "Titles, structure, internal links and content depth.",
          ],
        ],
      },
      {
        title: "Campaigns & Measurement",
        lessons: [
          [
            "Building Your First Campaign",
            "GJRXQnPhKGE",
            "26 min",
            "From objective to creative to budget.",
          ],
          [
            "Reading The Numbers",
            "gAkwW2tuIqE",
            "17 min",
            "Which metrics matter, and which are vanity.",
          ],
        ],
      },
    ],
  },
  {
    title: "Modern Web Development with React",
    slug: "modern-web-development-with-react",
    category: "Web Development",
    level: "Intermediate",
    pricingType: "paid",
    duration: "8h",
    instructor: "Hamza Bhatti",
    short: "Build production-grade interfaces with React, TypeScript and modern tooling.",
    description:
      "Go beyond tutorials. This course covers component architecture, state management, data fetching patterns, accessibility and the deployment workflow professional teams actually use.",
    status: "published",
    cover: "Tn6-PIqc4UM",
    language: "English",
    mode: "Online",
    accessPeriod: "Lifetime access",
    rating: 4.9,
    reviewCount: 1832,
    studentCount: 9670,
    price: 49,
    originalPrice: 99,
    learningOutcomes: [
      "Think in components and reason about React architecture with confidence",
      "Type components, props and hooks properly with TypeScript",
      "Apply data fetching patterns for loading, caching and error states",
      "Build for accessibility — keyboard, focus and semantics",
      "Ship and deploy a production-grade React app from local build to live URL",
      "Avoid the state-management overengineering that trips up new teams",
    ],
    requirements: [
      "Solid HTML and CSS, and basic JavaScript",
      "Node.js installed on your machine",
      "A code editor — VS Code works great",
    ],
    reviews: [
      {
        author: "Hannah Kim",
        role: "Frontend Developer",
        rating: 5,
        content:
          "The section on data fetching alone changed how I write features. Hamza explains patterns you actually use at work.",
      },
      {
        author: "Paras Mehta",
        role: "Junior Developer",
        rating: 5,
        content:
          "By the end I had deployed my first real project and understood why each pattern exists. Worth every penny.",
      },
      {
        author: "Lena Vogel",
        role: "Product Designer",
        rating: 4,
        content:
          "Very thorough on TypeScript and accessibility. Some scenes are fast — pause and replay helps.",
      },
    ],
    instructorProfile: {
      role: "Course Instructor",
      bio: "Hamza has built and shipped interfaces for agencies and product teams for over eight years. He cares about code that survives contact with real users — clear types, accessible markup and boring, reliable architecture.",
      rating: 4.9,
      students: 9670,
      courses: 4,
    },
    sections: [
      {
        title: "Getting Started",
        lessons: [
          [
            "React in 2026: The Landscape",
            "Tn6-PIqc4UM",
            "15 min",
            "Where React sits today and what changed.",
          ],
          [
            "Components and Props",
            "SqcY0GlETPk",
            "28 min",
            "The mental model that makes everything else easy.",
          ],
          [
            "State and Effects",
            "O6P86uwfdR0",
            "31 min",
            "When to reach for state, and when not to.",
          ],
        ],
      },
      {
        title: "TypeScript Essentials",
        lessons: [
          [
            "Why TypeScript",
            "zQnBQ4tB3ZA",
            "11 min",
            "The bugs it removes before you run the app.",
          ],
          [
            "Typing Components Properly",
            "ydkQlJhodio",
            "24 min",
            "Props, generics and inference in practice.",
          ],
        ],
      },
      {
        title: "Shipping",
        lessons: [
          [
            "Data Fetching Patterns",
            "novnyCaa7To",
            "22 min",
            "Loading, caching and error states done right.",
          ],
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
    pricingType: "free",
    duration: "4h",
    instructor: "Hamza Bhatti",
    short: "Composition, colour and type — the fundamentals that make design work.",
    description:
      "Design is a craft with rules you can learn. This course walks through hierarchy, grid systems, colour theory and typography with real critiques of real work.",
    status: "published",
    cover: "YqQx75OPRa0",
    language: "English",
    mode: "Online",
    accessPeriod: "12 months access",
    rating: 4.7,
    reviewCount: 1204,
    studentCount: 8450,
    learningOutcomes: [
      "Apply the core principles of composition with confidence",
      "Build colour palettes that hold up in real layouts",
      "Pair typefaces and create readable type hierarchies",
      "Construct layouts and grids that scale across screens",
      "Understand and apply the rules behind real design critiques",
    ],
    requirements: [
      "No design experience required",
      "Any design tool — Figma, Illustrator or pen and paper",
      "An eye for detail and a willingness to refine",
    ],
    reviews: [
      {
        author: "Mia Novotna",
        role: "Freelance Illustrator",
        rating: 5,
        content:
          "Hamza explains design rules the way you wish a teacher would. My layouts look intentional now.",
      },
      {
        author: "Rohan Gupta",
        role: "Marketing Designer",
        rating: 4,
        content: "Short, focused and genuinely useful. The type pairing section is a keeper.",
      },
      {
        author: "Sofia Almeida",
        role: "Student",
        rating: 5,
        content: "I had never designed before and finished with a portfolio-ready poster series.",
      },
    ],
    instructorProfile: {
      role: "Course Instructor",
      bio: "Hamza is a brand and editorial designer who has worked across print and digital for over a decade. He teaches fundamentals through the same critiques he gives professional work in the studio.",
      rating: 4.8,
      students: 8450,
      courses: 5,
    },
    sections: [
      {
        title: "Seeing Like a Designer",
        lessons: [
          [
            "Principles of Composition",
            "YqQx75OPRa0",
            "17 min",
            "Balance, contrast, repetition and alignment.",
          ],
          [
            "Colour Theory in Practice",
            "_2LLXnUdUIc",
            "20 min",
            "Building palettes that hold up in real layouts.",
          ],
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
    pricingType: "paid",
    duration: "3h",
    instructor: "Hamza Bhatti",
    short: "Positioning, pricing and pitching for independent professionals.",
    description:
      "A grounded guide to starting freelance work: how to position yourself, what to charge, where to find clients and how to write proposals that get replies.",
    status: "published",
    cover: "GjJTgL1Y2Uk",
    language: "English",
    mode: "Online",
    accessPeriod: "Lifetime access",
    rating: 4.8,
    reviewCount: 918,
    studentCount: 6320,
    price: 29,
    originalPrice: 59,
    learningOutcomes: [
      "Position your service and niche down without boxing yourself in",
      "Price your work confidently — hourly, project or value-based",
      "Find clients even when your portfolio is still thin",
      "Write proposals that get replies and booked calls",
      "Run the first client call with calm, structure and next steps",
    ],
    requirements: [
      "A skill you can sell — design, code, writing or marketing",
      "Any device with internet access",
      "Willingness to reach out and follow up",
    ],
    reviews: [
      {
        author: "Diksha Rao",
        role: "Web Copywriter",
        rating: 5,
        content:
          "The proposal template alone changed my reply rate. First retainer signed three weeks in.",
      },
      {
        author: "Noah Berg",
        role: "Motion Designer",
        rating: 5,
        content: "Straight talk, zero hype. Hamza walks you through pricing without the fluff.",
      },
      {
        author: "Elena Petrova",
        role: "Developer",
        rating: 4,
        content:
          "Packed with practical scripts for the first call. Short enough to finish in a weekend.",
      },
    ],
    instructorProfile: {
      role: "Course Instructor",
      bio: "Hamza has run a six-figure freelance practice and coached dozens of newcomers through their first clients. He teaches what actually works — positioning, pricing and the unglamorous habits that win work.",
      rating: 4.9,
      students: 6320,
      courses: 3,
    },
    sections: [
      {
        title: "Setting Up",
        lessons: [
          [
            "Positioning Your Service",
            "GjJTgL1Y2Uk",
            "16 min",
            "Niche down without boxing yourself in.",
          ],
          [
            "Pricing Your Work",
            "cs8VXcU2p9Y",
            "21 min",
            "Hourly, project and value-based pricing compared.",
          ],
        ],
      },
      {
        title: "Finding Clients",
        lessons: [
          [
            "Where Clients Actually Are",
            "8jjbBLp7Cvo",
            "19 min",
            "Channels that work when you have no portfolio.",
          ],
          [
            "Writing Proposals That Convert",
            "Fdi7BSbNbUw",
            "24 min",
            "Structure, tone and follow-up.",
          ],
          [
            "Handling The First Call",
            "1Sr3wSyLnc0",
            "14 min",
            "Qualify, listen, and close calmly.",
          ],
        ],
      },
    ],
  },
  {
    title: "Business Fundamentals for Creators",
    slug: "business-fundamentals-for-creators",
    category: "Business",
    level: "Beginner",
    pricingType: "free",
    duration: "5h",
    instructor: "Hamza Bhatti",
    short: "The commercial side of creative work — offers, cashflow and growth.",
    description:
      "Draft course covering business models, unit economics, cashflow planning and sustainable growth for people who make things for a living.",
    status: "draft",
    cover: "SU8Q3G_LWzc",
    language: "English",
    mode: "Online",
    accessPeriod: "6 months access",
    rating: 4.6,
    reviewCount: 759,
    studentCount: 4980,
    learningOutcomes: [
      "Model your creative practice as a real business",
      "Design offers that package your work so it sells itself",
      "Plan cashflow, invoicing and buffers for stability",
      "Know the unit economics behind every sale you make",
      "Choose growth moves that fit your time and energy",
    ],
    requirements: [
      "A creative practice or side project",
      "Basic comfort with spreadsheets",
      "Honest numbers about what you currently earn",
    ],
    reviews: [
      {
        author: "Amar Choudhury",
        role: "Photographer",
        rating: 5,
        content:
          "The unit economics chapter reframed how I price everything. Clear, calm, practical.",
      },
      {
        author: "Grace Adeyemi",
        role: "Handmade Seller",
        rating: 5,
        content: "Finally a business course that treats creative people like adults.",
      },
      {
        author: "Diego Fuentes",
        role: "Illustrator",
        rating: 4,
        content: "Great structure and real numbers. I wish I had this three years ago.",
      },
    ],
    instructorProfile: {
      role: "Course Instructor",
      bio: "Hamza combines a finance background with years of coaching independent studios. He translates boring-but-important business mechanics into simple habits creative teams actually adopt.",
      rating: 4.7,
      students: 4980,
      courses: 3,
    },
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
          [
            "Simple Unit Economics",
            "Xk8xNMGGdTU",
            "19 min",
            "Knowing what each sale really earns.",
          ],
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
      email: "admin@lms.pk",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: iso(200),
    },
    ...[
      "Ali Raza",
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
      email: i === 0 ? "ali@student.pk" : `${name.split(" ")[0]!.toLowerCase()}@student.dev`,
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
      pricingType: bp.pricingType,
      duration: bp.duration,
      instructor: bp.instructor,
      status: bp.status,
      createdAt: iso(90 - ci * 9),
      updatedAt: iso(5 + ci),
      language: bp.language,
      mode: bp.mode,
      accessPeriod: bp.accessPeriod,
      rating: bp.rating,
      reviewCount: bp.reviewCount,
      studentCount: bp.studentCount,
      videoPreview: youtubeEmbed(bp.cover),
      learningOutcomes: bp.learningOutcomes,
      requirements: bp.requirements,
      reviews: bp.reviews.map((r, ri) => ({
        id: `${courseId}-rev-${ri + 1}`,
        author: r.author,
        role: r.role,
        rating: r.rating,
        content: r.content,
        date: iso(28 + ri * 11),
      })),
      instructorProfile: { ...bp.instructorProfile },
      ...(bp.price !== undefined ? { price: bp.price } : {}),
      ...(bp.originalPrice !== undefined ? { originalPrice: bp.originalPrice } : {}),
    });

    bp.sections.forEach((sec, si) => {
      const sectionId = `${courseId}-sec-${si + 1}`;
      sections.push({ id: sectionId, courseId, title: sec.title, order: si });
      sec.lessons.forEach((l, li) => {
        const resources: string[] = [];
        if (si === 0 && li === 0) {
          resources.push("https://example.com/digital-marketing-guide.pdf");
          resources.push("https://example.com/marketing-templates.zip");
        }
        if (si === 1 && li === 0) {
          resources.push("https://example.com/seo-checklist.pdf");
        }
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
          ...(resources.length > 0 ? { resources } : {}),
        });
      });
    });
  });

  const lessonsOf = (courseId: string) =>
    sections
      .filter((s) => s.courseId === courseId)
      .sort((a, b) => a.order - b.order)
      .flatMap((s) =>
        lessons.filter((l) => l.sectionId === s.id).sort((a, b) => a.order - b.order),
      );

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
      accessStatus: "accepted",
      enrolledAt: iso(45 - i * 4),
      completedAt: isComplete ? iso(3) : null,
      lastLessonId: completedLessons[completedLessons.length - 1]?.id ?? all[0]?.id ?? null,
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

  return {
    users,
    categories,
    courses,
    sections,
    lessons,
    enrollments,
    enrollmentRequests: [],
    progress,
    resources: [
      {
        id: "res-1",
        title: "Modern Dashboard UI Kit",
        description:
          "A clean and modern dashboard UI kit with 50+ components built for Figma and Figma.",
        type: "UI Kit",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "12.5 MB",
      },
      {
        id: "res-2",
        title: "Social Media Post Templates",
        description:
          "20+ ready-to-use social media templates for Instagram, Facebook, and Twitter.",
        type: "Template",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "8.3 MB",
      },
      {
        id: "res-3",
        title: "Complete Branding Guide",
        description:
          "Learn how to build a memorable brand identity from scratch with this comprehensive guide.",
        type: "Guide",
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "2.1 MB",
      },
      {
        id: "res-4",
        title: "UI/UX Design Principles E-Book",
        description:
          "Master the fundamentals of user interface and experience design in 100 pages.",
        type: "E-Book",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "5.7 MB",
      },
      {
        id: "res-5",
        title: "Figma Prototyping Masterclass",
        description: "A step-by-step video tutorial on creating advanced prototypes in Figma.",
        type: "Video",
        image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "250 MB",
      },
      {
        id: "res-6",
        title: "Icon Pack — 500+ Icons",
        description:
          "A versatile icon set covering 50+ categories, available in SVG and PNG formats.",
        type: "Graphic",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "15.2 MB",
      },
      {
        id: "res-7",
        title: "Landing Page Wireframe Kit",
        description:
          "10 high-fidelity wireframe templates for SaaS, portfolio, and e-commerce landing pages.",
        type: "UI Kit",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "6.8 MB",
      },
      {
        id: "res-8",
        title: "Color Palette Generator Guide",
        description:
          "Discover how to create harmonious color palettes that elevate your design work.",
        type: "Guide",
        image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "1.4 MB",
      },
      {
        id: "res-9",
        title: "Motion Design Fundamentals",
        description:
          "Video course covering animation principles, easing, and micro-interactions for UI.",
        type: "Video",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
        downloadUrl: "#",
        fileSize: "380 MB",
      },
    ],
  };
}

/**
 * Fresh data for a newly signed-up student: catalog stays, but no demo users,
 * enrollments or progress from the seed bleed into their dashboard.
 */
export function buildEmptyData(): LmsData {
  const seed = buildSeed();
  return { ...seed, users: [], enrollments: [], enrollmentRequests: [], progress: [] };
}
