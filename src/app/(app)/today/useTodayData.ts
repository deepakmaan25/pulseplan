"use client";

import { useMemo } from "react";
import { usePosts } from "@/store/PostsContext";
import type { MockPost } from "@/mocks/fixtures";

/**
 * Demo reference date. The mock fixtures are dated around this day so the
 * screen always looks populated in the portfolio. When real data exists,
 * pass `new Date().toISOString().slice(0,10)` (or remove the default) to make
 * "today" actually today. Single source — change here only.
 */
export const DEMO_REFERENCE_DATE = "2026-05-16";

const PRIORITY_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

export function parseTimeToMinutes(timeStr: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(timeStr);
  if (!match) return 9999;
  let hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const meridiem = (match[3] ?? "AM").toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function sortByPriority(posts: MockPost[]): MockPost[] {
  return [...posts].sort((a, b) => {
    const pa = a.priority ? (PRIORITY_ORDER[a.priority] ?? 3) : 3;
    const pb = b.priority ? (PRIORITY_ORDER[b.priority] ?? 3) : 3;
    if (pa !== pb) return pa - pb;
    const ta = a.time ? parseTimeToMinutes(a.time) : 9999;
    const tb = b.time ? parseTimeToMinutes(b.time) : 9999;
    return ta - tb;
  });
}

function sortByTime(posts: MockPost[]): MockPost[] {
  return [...posts].sort((a, b) => {
    const ta = a.time ? parseTimeToMinutes(a.time) : 9999;
    const tb = b.time ? parseTimeToMinutes(b.time) : 9999;
    return ta - tb;
  });
}

export interface TodayData {
  posts: MockPost[];
  overdue: MockPost[];
  todayPosts: MockPost[];
  upNext: MockPost[];
  needsEyes: MockPost[];
  justShipped: MockPost | undefined;
  hasToday: boolean;
  hasOther: boolean;
  greetingSub: string;
  referenceDate: string;
}

/**
 * All Today-screen derivations in one place, so TodayMobile and TodayDesktop
 * render identical data in different arrangements. Pure w.r.t. its inputs
 * (posts + referenceDate); trivially unit-testable.
 */
export function useTodayData(referenceDate: string = DEMO_REFERENCE_DATE): TodayData {
  const { posts } = usePosts();

  return useMemo<TodayData>(() => {
    const overdue = sortByPriority(posts.filter((p) => p.status === "overdue"));

    const todayPosts = sortByTime(
      posts.filter(
        (p) => p.scheduledDate === referenceDate && p.status !== "overdue",
      ),
    );

    const upNext = posts
      .filter(
        (p) =>
          p.status === "sched" &&
          p.scheduledDate &&
          p.scheduledDate > referenceDate,
      )
      .sort((a, b) => {
        const dc = (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? "");
        if (dc !== 0) return dc;
        const ta = a.time ? parseTimeToMinutes(a.time) : 9999;
        const tb = b.time ? parseTimeToMinutes(b.time) : 9999;
        return ta - tb;
      })
      .slice(0, 3);

    const needsEyes = posts
      .filter((p) => p.status === "draft" || p.status === "review")
      .slice(0, 3);

    const justShipped = posts
      .filter((p) => p.status === "pub")
      .sort((a, b) =>
        (b.scheduledDate ?? "").localeCompare(a.scheduledDate ?? ""),
      )[0];

    const hasToday = todayPosts.length > 0 || overdue.length > 0;
    const hasOther =
      upNext.length > 0 || needsEyes.length > 0 || justShipped !== undefined;

    const greetingSub = (() => {
      if (todayPosts.length === 0) return "Nothing scheduled today";
      const count = todayPosts.length;
      const label = count === 1 ? "post" : "posts";
      const first = todayPosts[0];
      const nextTime = first?.time ? ` · next at ${first.time}` : "";
      return `${count} ${label} today${nextTime}`;
    })();

    return {
      posts,
      overdue,
      todayPosts,
      upNext,
      needsEyes,
      justShipped,
      hasToday,
      hasOther,
      greetingSub,
      referenceDate,
    };
  }, [posts, referenceDate]);
}
