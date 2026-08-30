import type { Lesson } from "./lms/types";

/** Parse a duration string (HH:MM:SS, MM:SS, Xmin, Xh, or bare number) into seconds. */
export function parseDurationToSeconds(duration: string): number {
  const d = duration.trim();
  const minMatch = /^(\d+)\s*min$/i.exec(d);
  if (minMatch) return parseInt(minMatch[1]!, 10) * 60;
  const hourMatch = /^(\d+(?:\.\d+)?)\s*h$/i.exec(d);
  if (hourMatch) return Math.round(parseFloat(hourMatch[1]!) * 3600);
  const bareMatch = /^(\d+)$/.exec(d);
  if (bareMatch) return parseInt(bareMatch[1]!, 10) * 60;
  const parts = d.split(":");
  if (parts.length === 3) {
    const h = parseInt(parts[0]!, 10);
    const m = parseInt(parts[1]!, 10);
    const s = parseInt(parts[2]!, 10);
    return (isNaN(h) ? 0 : h) * 3600 + (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
  }
  if (parts.length === 2) {
    const m = parseInt(parts[0]!, 10);
    const s = parseInt(parts[1]!, 10);
    return (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
  }
  if (parts.length === 1) {
    const m = parseInt(parts[0]!, 10);
    if (!isNaN(m)) return m * 60;
  }
  return 0;
}

/** Format a number with locale-aware separators. */
export function formatCount(n?: number) {
  return n == null ? "" : n.toLocaleString("en-US");
}

/** Format total duration of lessons into a human-readable string. */
export function formatTotalDuration(lessons: Lesson[]) {
  if (lessons.length === 0) return "";
  const total = lessons.reduce((acc, l) => {
    const hmsMatch = /^(\d+):(\d+):(\d+)$/.exec(l.duration);
    if (hmsMatch) {
      return acc + parseInt(hmsMatch[1]!, 10) * 60 + parseInt(hmsMatch[2]!, 10);
    }
    const colonMatch = /^(\d+):(\d+)$/.exec(l.duration);
    if (colonMatch) {
      return acc + parseInt(colonMatch[1]!, 10);
    }
    const minMatch = /(\d+)\s*min/.exec(l.duration);
    if (minMatch) {
      return acc + parseInt(minMatch[1]!, 10);
    }
    const numMatch = /^(\d+)$/.exec(l.duration);
    if (numMatch) {
      return acc + parseInt(numMatch[1]!, 10);
    }
    return acc;
  }, 0);
  if (total === 0) return "";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}
