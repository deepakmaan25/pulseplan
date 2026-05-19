"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { PostRow } from "@/components/post/PostRow";
import { usePosts } from "@/store/PostsContext";
import type { MockPost } from "@/mocks/fixtures";
import styles from "./today.module.css";

const TODAY = "2026-05-16";

const PRIORITY_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

function parseTimeToMinutes(timeStr: string): number {
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function capitalizeFirst(str: string): string {
  return str.length > 0 ? (str[0]?.toUpperCase() ?? "") + str.slice(1) : str;
}

function formatHomeDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface StatPillProps {
  count: number;
  label: string;
  tone?: "default" | "primary" | "success" | "danger";
}

function StatPill({ count, label, tone = "default" }: StatPillProps) {
  return (
    <div
      className={`${styles.statPill} ${styles[`statPill_${tone}`]}`}
      role="listitem"
    >
      <span className={styles.statCount}>{count}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function TodayClient() {
  const router = useRouter();
  const { posts } = usePosts();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pp2-onboarding");
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string };
        const full = parsed.name?.trim() ?? "";
        setFirstName(full ? (full.split(" ")[0] ?? "") : "");
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const overdue = sortByPriority(posts.filter((p) => p.status === "overdue"));
  const todayPosts = sortByPriority(
    posts.filter((p) => p.scheduledDate === TODAY && p.status !== "overdue"),
  );
  const hasAnything = overdue.length > 0 || todayPosts.length > 0;

  const statScheduled = posts.filter((p) => p.status === "sched").length;
  const statInProgress = posts.filter(
    (p) => p.status === "draft" || p.status === "review",
  ).length;
  const statPublished = posts.filter((p) => p.status === "pub").length;
  const statOverdue = overdue.length;

  function openPost(id: string) {
    router.push(`/post/${id}`);
  }

  return (
    <div>
      {/* Home header — wordmark + action icons */}
      <div className={styles.homeHeader} style={{ paddingTop: "var(--s-4)" }}>
        <span className={styles.homeWordmark}>PulsePlan</span>
        <div className={styles.homeHeaderActions}>
          <IconButton
            icon={<Bell size={20} />}
            label="Notifications"
            variant="ghost"
            size={40}
          />
          <IconButton
            icon={<Settings size={20} />}
            label="Settings"
            variant="ghost"
            size={40}
            onClick={() => router.push("/settings")}
          />
        </div>
      </div>

      <div className={styles.content}>
        {/* Greeting */}
        <div className={styles.greeting}>
          <p className={styles.greetingLine}>
            {getGreeting()}
            {firstName ? `, ${capitalizeFirst(firstName)}` : ""}.
          </p>
          <p className={styles.greetingDate}>{formatHomeDate(TODAY)}</p>
        </div>

        {/* Pipeline stat strip */}
        <div
          className={styles.statsRow}
          role="list"
          aria-label="Content pipeline"
        >
          <StatPill count={statScheduled} label="Scheduled" tone="primary" />
          <StatPill count={statInProgress} label="In Progress" tone="default" />
          <StatPill count={statPublished} label="Published" tone="success" />
          {statOverdue > 0 && (
            <StatPill count={statOverdue} label="Overdue" tone="danger" />
          )}
        </div>

        {/* Empty state */}
        {!hasAnything && (
          <EmptyState
            icon="✨"
            title="You're all clear"
            description="Nothing scheduled today. Tap + to capture an idea."
          />
        )}

        {/* Overdue */}
        {overdue.length > 0 && (
          <section aria-label="Overdue posts">
            <p
              className={`${styles.sectionLabel} ${styles.sectionLabelDanger}`}
            >
              {overdue.length === 1
                ? "1 post overdue"
                : `${overdue.length} posts overdue`}
            </p>
            <div className={styles.list}>
              {overdue.map((post) => (
                <PostRow
                  key={post.id}
                  title={post.title}
                  time={post.time}
                  status={post.status}
                  pillar={post.pillar}
                  platform={post.platform}
                  postType={post.postType}
                  priority={post.priority}
                  onClick={() => openPost(post.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Today's posts */}
        {todayPosts.length > 0 && (
          <section aria-label="Today's posts">
            <p className={styles.sectionLabel}>
              {todayPosts.length === 1
                ? "1 post today"
                : `${todayPosts.length} posts today`}
            </p>
            <div className={styles.list}>
              {todayPosts.map((post) => (
                <PostRow
                  key={post.id}
                  title={post.title}
                  time={post.time}
                  status={post.status}
                  pillar={post.pillar}
                  platform={post.platform}
                  postType={post.postType}
                  priority={post.priority}
                  onClick={() => openPost(post.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
