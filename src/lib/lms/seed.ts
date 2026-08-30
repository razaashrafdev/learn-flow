import type { LmsData } from "./types";

/**
 * Returns a completely empty LmsData object.
 * All data should come from the backend API — no seed/fallback data.
 */
export function buildEmptyData(): LmsData {
  return {
    users: [],
    categories: [],
    courses: [],
    sections: [],
    lessons: [],
    enrollments: [],
    enrollmentRequests: [],
    progress: [],
    resources: [],
  };
}
