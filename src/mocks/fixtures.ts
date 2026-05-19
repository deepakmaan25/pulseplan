import type { PostStatus } from "@/components/ui/chips/StatusChip";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import type { Priority } from "@/components/ui/chips/PriorityChip";

export interface Pillar {
  id: string;
  name: string;
  color: string;
}

export interface MockPost {
  id: string;
  title: string;
  description?: string;
  draft?: string;
  notes?: string;
  status: PostStatus;
  platform: Platform;
  pillar: Pillar;
  priority?: Priority;
  time?: string;
  postType?: string;
  scheduledDate?: string; // YYYY-MM-DD
}

const MINDSET: Pillar = { id: "mindset", name: "Mindset", color: "#2e5bff" };
const BUSINESS: Pillar = { id: "business", name: "Business", color: "#0e9f6e" };
const TECH: Pillar = { id: "tech", name: "Tech", color: "#6d28d9" };
const PERSONAL: Pillar = { id: "personal", name: "Personal", color: "#d97706" };

export const PILLARS: Pillar[] = [MINDSET, BUSINESS, TECH, PERSONAL];

export const POSTS: MockPost[] = [
  // Today — 2026-05-16
  {
    id: "t1",
    title: "The one habit that changed how I approach every morning session",
    description:
      "Walk through the 5-minute pre-work ritual I've used every day for a year. Show the journal, the intention-setting, and why it compounds.",
    status: "sched",
    platform: "ig",
    pillar: MINDSET,
    priority: "P1",
    time: "9:00 AM",
    postType: "Reel",
    scheduledDate: "2026-05-16",
  },
  {
    id: "t2",
    title: "Why your content strategy is missing this key element",
    description:
      "Most creators plan what to post but not why. Cover the 'distribution-first' mental model — pick the platform before the format, not after.",
    status: "sched",
    platform: "li",
    pillar: BUSINESS,
    priority: "P0",
    time: "12:00 PM",
    postType: "Article",
    scheduledDate: "2026-05-16",
  },
  {
    id: "t3",
    title: "Building in public — what I learned after 6 months of shipping",
    status: "draft",
    platform: "x",
    pillar: BUSINESS,
    priority: "P2",
    time: "3:00 PM",
    postType: "Thread",
    scheduledDate: "2026-05-16",
  },
  // Tomorrow — 2026-05-17
  {
    id: "tm1",
    title: "The framework I use to create 30 days of content in 3 hours",
    status: "sched",
    platform: "yt",
    pillar: BUSINESS,
    priority: "P1",
    time: "10:00 AM",
    postType: "Short",
    scheduledDate: "2026-05-17",
  },
  {
    id: "tm2",
    title: "How I automated my posting schedule without losing authenticity",
    status: "sched",
    platform: "ig",
    pillar: TECH,
    priority: "P2",
    time: "6:00 PM",
    postType: "Carousel",
    scheduledDate: "2026-05-17",
  },
  // Earlier in the week
  {
    id: "w1",
    title: "Deep work vs shallow work — the solo creator edition",
    status: "review",
    platform: "li",
    pillar: MINDSET,
    priority: "P2",
    time: "9:00 AM",
    postType: "Article",
    scheduledDate: "2026-05-13",
  },
  {
    id: "th1",
    title: "5 tools that saved me 10 hours a week as a solo creator",
    status: "idea",
    platform: "th",
    pillar: TECH,
    priority: "P2",
    scheduledDate: "2026-05-14",
  },
  {
    id: "f1",
    title: "My exact content creation setup for 2026",
    status: "idea",
    platform: "yt",
    pillar: TECH,
    priority: "P2",
    scheduledDate: "2026-05-15",
  },
  // Published
  {
    id: "p1",
    title: "Stop chasing virality — build an audience instead",
    status: "pub",
    platform: "x",
    pillar: BUSINESS,
    time: "8:00 AM",
    postType: "Thread",
    scheduledDate: "2026-05-14",
  },
  {
    id: "p2",
    title: "The mindset shift that 10x'd my output as a creator",
    status: "pub",
    platform: "ig",
    pillar: MINDSET,
    time: "6:00 PM",
    postType: "Reel",
    scheduledDate: "2026-05-13",
  },
  {
    id: "p3",
    title: "3 reasons most creators quit before they find their voice",
    status: "pub",
    platform: "li",
    pillar: BUSINESS,
    time: "11:00 AM",
    postType: "Article",
    scheduledDate: "2026-05-11",
  },
  // Overdue
  {
    id: "ov1",
    title: "Consistency vs quality — what actually matters for growth",
    status: "overdue",
    platform: "li",
    pillar: BUSINESS,
    priority: "P0",
    time: "2:00 PM",
    postType: "Post",
    scheduledDate: "2026-05-12",
  },
];

export function postsForDate(date: string): MockPost[] {
  return POSTS.filter((p) => p.scheduledDate === date);
}

export function postsByStatus(status: PostStatus): MockPost[] {
  return POSTS.filter((p) => p.status === status);
}
