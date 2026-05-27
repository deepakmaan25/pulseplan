"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ToneIcon } from "@/components/ui/ToneIcon/ToneIcon";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import { OverdueCallout } from "@/components/post/OverdueCallout";
import { PostRow } from "@/components/post/PostRow";
import { usePosts } from "@/store/PostsContext";
import type { MockPost } from "@/mocks/fixtures";
import styles from "./today.module.css";

const TODAY = "2026-05-16";
const WEEK_START = "2026-05-10";

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

function sortByTime(posts: MockPost[]): MockPost[] {
  return [...posts].sort((a, b) => {
    const ta = a.time ? parseTimeToMinutes(a.time) : 9999;
    const tb = b.time ? parseTimeToMinutes(b.time) : 9999;
    return ta - tb;
  });
}

function formatDayStamp(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── KPI Grid ─────────────────────────────────────────────────────

interface KpiCellProps {
  value: number | string;
  label: string;
  tone?: "default" | "primary" | "success" | "danger";
}

function KpiCell({ value, label, tone = "default" }: KpiCellProps) {
  return (
    <div
      className={`${styles.kpiCell} ${tone !== "default" ? styles[`kpiCell_${tone}`] : ""}`}
      role="listitem"
    >
      <span className={styles.kpiValue}>{value}</span>
      <span className={styles.kpiLabel}>{label}</span>
    </div>
  );
}

// ── Just shipped card ─────────────────────────────────────────────

function JustShippedCard({
  post,
  onClick,
}: {
  post: MockPost;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.shippedCard} pp2-press`}
      onClick={onClick}
      aria-label={`Just shipped: ${post.title}. View insights.`}
    >
      <PlatformChip platform={post.platform} size="sm" showLabel={false} />
      <span className={styles.shippedTitle}>{post.title}</span>
      {post.scheduledDate ? (
        <span className={styles.shippedDate}>
          {formatDayStamp(post.scheduledDate)}
        </span>
      ) : null}
      <span className={styles.shippedCta} aria-hidden="true">
        Insights →
      </span>
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────

export function TodayClient() {
  const router = useRouter();
  const { posts } = usePosts();

  const overdue = sortByPriority(posts.filter((p) => p.status === "overdue"));
  const todayPosts = sortByTime(
    posts.filter((p) => p.scheduledDate === TODAY && p.status !== "overdue"),
  );

  // Up next — sched posts after today, sorted by date then time
  const upNext = posts
    .filter(
      (p) => p.status === "sched" && p.scheduledDate && p.scheduledDate > TODAY,
    )
    .sort((a, b) => {
      const dc = (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? "");
      if (dc !== 0) return dc;
      const ta = a.time ? parseTimeToMinutes(a.time) : 9999;
      const tb = b.time ? parseTimeToMinutes(b.time) : 9999;
      return ta - tb;
    })
    .slice(0, 3);

  // Needs your eyes — draft + review
  const needsEyes = posts
    .filter((p) => p.status === "draft" || p.status === "review")
    .slice(0, 3);

  // Just shipped — most recent published post
  const justShipped = posts
    .filter((p) => p.status === "pub")
    .sort((a, b) =>
      (b.scheduledDate ?? "").localeCompare(a.scheduledDate ?? ""),
    )[0];

  // KPI values
  const kpiToday = todayPosts.length;
  const kpiWk = posts.filter(
    (p) =>
      p.status === "pub" &&
      p.scheduledDate != null &&
      p.scheduledDate >= WEEK_START &&
      p.scheduledDate <= TODAY,
  ).length;
  const kpiDrafts = posts.filter(
    (p) => p.status === "draft" || p.status === "review",
  ).length;
  const kpiPace = kpiWk;

  const hasToday = todayPosts.length > 0 || overdue.length > 0;
  const hasOther =
    upNext.length > 0 || needsEyes.length > 0 || justShipped !== undefined;

  function openPost(id: string) {
    router.push(`/post/${id}`);
  }

  return (
    <div>
      <AppHeader showGreeting style={{ paddingTop: "var(--s-4)" }} />

      <div className={styles.content}>
        {/* KPI grid — 4 cells in a single Surface card */}
        <div className={styles.kpiWrapper}>
          <div
            className={styles.kpiGrid}
            role="list"
            aria-label="Content pipeline"
          >
            <KpiCell value={kpiToday} label="Today" tone="primary" />
            <KpiCell value={kpiWk} label="Wk" tone="success" />
            <KpiCell value={kpiDrafts} label="Drafts" />
            <KpiCell value={kpiPace} label="Pace" />
          </div>
          <span className={styles.paceBadge} aria-hidden="true">
            ● on pace
          </span>
        </div>

        {/* Empty state — only shown when truly nothing */}
        {!hasToday && !hasOther && (
          <EmptyState
            icon={
              <ToneIcon
                icon={<Sparkles size={18} />}
                tone="primary"
                size={36}
              />
            }
            title="You're all clear"
            description="Nothing scheduled today. Tap + to capture an idea."
          />
        )}

        {/* Overdue callout cards */}
        {overdue.length > 0 && (
          <section aria-label="Overdue posts">
            <p
              className={`${styles.sectionLabel} ${styles.sectionLabelDanger}`}
            >
              {overdue.length === 1
                ? "1 post overdue"
                : `${overdue.length} posts overdue`}
            </p>
            <div className={styles.calloutList}>
              {overdue.map((post) => (
                <OverdueCallout
                  key={post.id}
                  title={post.title}
                  onTap={() => openPost(post.id)}
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

        {/* Up next */}
        {upNext.length > 0 && (
          <section aria-label="Up next">
            <p className={styles.sectionLabel}>Up next</p>
            <div className={styles.list}>
              {upNext.map((post) => (
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

        {/* Needs your eyes */}
        {needsEyes.length > 0 && (
          <section aria-label="Needs your eyes">
            <p className={styles.sectionLabel}>Needs your eyes</p>
            <div className={styles.list}>
              {needsEyes.map((post) => (
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

        {/* Just shipped */}
        {justShipped && (
          <section aria-label="Just shipped">
            <p className={styles.sectionLabel}>Just shipped</p>
            <JustShippedCard
              post={justShipped}
              onClick={() => router.push("/analytics" as never)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
