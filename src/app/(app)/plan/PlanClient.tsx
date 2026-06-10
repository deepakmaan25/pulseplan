"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { BoardCard } from "@/components/post/BoardCard";
import { OverdueCallout } from "@/components/post/OverdueCallout";
import { PostRow } from "@/components/post/PostRow";
import { Segmented } from "@/components/ui/Segmented/Segmented";
import { usePosts } from "@/store/PostsContext";
import styles from "./plan.module.css";

const TODAY = "2026-05-16";
const WEEK_NUM = 20;

type ViewMode = "wk" | "mo";

const VIEW_OPTIONS = [
  { value: "wk" as const, label: "Wk" },
  { value: "mo" as const, label: "Mo", disabled: true },
] as const;

interface WeekDay {
  date: string;
  label: string; // full readable, for aria
  dayDisplay: string; // visual: "Mon · May 11"
  weekdayShort: string; // "Mon"
  dayLetter: string; // narrow: "M"
  dayNum: number;
  isToday: boolean;
}

function getWeekDays(): WeekDay[] {
  const weekStart = new Date("2026-05-11T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const weekdayShort = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      date: iso,
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      dayDisplay: `${weekdayShort} · ${monthDay}`,
      weekdayShort,
      dayLetter: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      dayNum: d.getDate(),
      isToday: iso === TODAY,
    };
  });
}

function weekRangeKicker(days: WeekDay[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return `WK ${WEEK_NUM}`;
  const fmt = (d: WeekDay) =>
    new Date(d.date + "T00:00:00")
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  return `WK ${WEEK_NUM} · ${fmt(first)} — ${fmt(last)}`;
}

function weekdayFull(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function PlanClient() {
  const router = useRouter();
  const { posts } = usePosts();
  const days = getWeekDays();
  const [viewMode, setViewMode] = useState<ViewMode>("wk");

  // Scroll to a day row
  const scrollToDay = useCallback((date: string) => {
    document
      .getElementById(`plan-day-${date}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Overdue posts
  const overduePosts = posts.filter((p) => p.status === "overdue");

  // Posts per day (all statuses except overdue)
  const postsForDay = (date: string) =>
    posts.filter((p) => p.scheduledDate === date && p.status !== "overdue");

  // Unscheduled tray — idea/draft without a scheduled date
  const unscheduled = posts.filter(
    (p) => (p.status === "idea" || p.status === "draft") && !p.scheduledDate,
  );

  // Week-total: only posts scheduled within this week
  const weekStart = days[0]?.date ?? "";
  const weekEnd = days[6]?.date ?? "";
  const weekPlanned = posts.filter(
    (p) =>
      p.scheduledDate != null &&
      p.scheduledDate >= weekStart &&
      p.scheduledDate <= weekEnd,
  ).length;

  function openPost(id: string) {
    router.push(`/post/${id}`);
  }

  return (
    <div>
      <AppHeader
        variant="prominent"
        kicker={weekRangeKicker(days)}
        title="Plan"
        subtitle={
          weekPlanned > 0 ? `${weekPlanned} planned this week` : undefined
        }
        trailingExtra={
          <>
            <IconButton
              icon={<SlidersHorizontal size={20} />}
              label="Filter"
              size={40}
            />
            <Segmented
              options={VIEW_OPTIONS}
              value={viewMode}
              onChange={setViewMode}
              ariaLabel="View period"
              size="sm"
            />
          </>
        }
        style={{ paddingTop: "var(--s-4)" }}
      />

      {/* Sticky week strip */}
      <div className={styles.weekStrip} aria-label="Week navigation">
        {days.map((day) => {
          const count = postsForDay(day.date).length;
          const pipCount = Math.min(count, 3);
          return (
            <button
              key={day.date}
              type="button"
              className={`${styles.stripCell} ${day.isToday ? styles.stripCellToday : ""}`}
              onClick={() => scrollToDay(day.date)}
              aria-label={`${day.label}${count > 0 ? `, ${count} posts` : ""}`}
              aria-current={day.isToday ? "date" : undefined}
            >
              <span className={styles.stripLetter}>{day.dayLetter}</span>
              <span className={styles.stripNum}>{day.dayNum}</span>
              <span className={styles.stripPips} aria-hidden="true">
                {Array.from({ length: pipCount }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.stripPip} ${day.isToday ? styles.stripPipToday : ""}`}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.content}>
        {/* Overdue callouts — first */}
        {overduePosts.length > 0 && (
          <section aria-label="Overdue posts">
            <p className={`${styles.dayLabel} ${styles.dayLabelDanger}`}>
              Overdue
            </p>
            <div className={styles.callouts}>
              {overduePosts.map((post) => (
                <OverdueCallout
                  key={post.id}
                  title={post.title}
                  onTap={() => openPost(post.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Unscheduled tray — second */}
        {unscheduled.length > 0 && (
          <section aria-label="Unscheduled posts">
            <div className={styles.trayHead}>
              <div className={styles.trayHeadL}>
                <span className={styles.trayLabel}>Unscheduled</span>
                <span className={styles.trayCount}>{unscheduled.length}</span>
                <span className={styles.trayHint}>· tap to schedule</span>
              </div>
              <button type="button" className={styles.viewAll}>
                View all
              </button>
            </div>
            <div className={styles.trayWrapper}>
              <div className={styles.tray}>
                {unscheduled.map((post) => (
                  <div key={post.id} className={styles.trayCard}>
                    <BoardCard
                      title={post.title}
                      pillar={post.pillar}
                      platform={post.platform}
                      status={post.status}
                      postType={post.postType}
                      priority={post.priority}
                      onClick={() => openPost(post.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className={styles.hairline} />

        {/* Day rows */}
        {days.map((day) => {
          const dayPosts = postsForDay(day.date);
          return (
            <section
              key={day.date}
              id={`plan-day-${day.date}`}
              aria-label={day.label}
            >
              <div className={styles.dayHeader}>
                <div className={styles.dayHeadL}>
                  <span className={styles.dayName}>
                    {day.isToday ? "Today" : weekdayFull(day.date)}
                  </span>
                  <span className={styles.dayDate}>
                    MAY {day.dayNum}
                    {day.isToday ? " · now" : ""}
                  </span>
                </div>
                <span className={styles.dayCount}>
                  {dayPosts.length === 0
                    ? "empty"
                    : `${dayPosts.length} planned`}
                </span>
              </div>
              {dayPosts.length > 0 ? (
                <div className={styles.list}>
                  {dayPosts.map((post) => (
                    <PostRow
                      key={post.id}
                      title={post.title}
                      time={post.time}
                      reminderHint={
                        post.status === "sched" ? "30m before" : undefined
                      }
                      status={post.status}
                      pillar={post.pillar}
                      platform={post.platform}
                      postType={post.postType}
                      priority={post.priority}
                      onClick={() => openPost(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.emptyDayCta}
                  onClick={() => openPost("new")}
                  aria-label={`Schedule for ${day.label}`}
                >
                  + Schedule for {day.weekdayShort}
                </button>
              )}
            </section>
          );
        })}

        <p className={styles.footerNote}>
          End of week · {weekPlanned} items planned
        </p>
      </div>
    </div>
  );
}
