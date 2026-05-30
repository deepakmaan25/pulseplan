"use client";

import type { MockPost } from "@/mocks/fixtures";
import styles from "./WeekHero.module.css";

const WEEK_DAYS = [
  { iso: "2026-05-11", letter: "M", n: 11 },
  { iso: "2026-05-12", letter: "T", n: 12 },
  { iso: "2026-05-13", letter: "W", n: 13 },
  { iso: "2026-05-14", letter: "T", n: 14 },
  { iso: "2026-05-15", letter: "F", n: 15 },
  { iso: "2026-05-16", letter: "S", n: 16, today: true },
  { iso: "2026-05-17", letter: "S", n: 17 },
] as const;

const WEEK_START = "2026-05-11";
const WEEK_END = "2026-05-17";

interface WeekHeroProps {
  posts: MockPost[];
}

export function WeekHero({ posts }: WeekHeroProps) {
  const weekTotal = WEEK_DAYS.reduce(
    (sum, d) => sum + posts.filter((p) => p.scheduledDate === d.iso).length,
    0,
  );

  const pubCount = posts.filter(
    (p) =>
      p.status === "pub" &&
      p.scheduledDate != null &&
      p.scheduledDate >= WEEK_START &&
      p.scheduledDate <= WEEK_END,
  ).length;

  const draftCount = posts.filter(
    (p) => p.status === "draft" || p.status === "review",
  ).length;

  return (
    <div className={styles.hero} aria-label="This week overview">
      <div className={styles.heroTop}>
        <span className={styles.heroLabel}>This week</span>
        <span className={styles.heroTotal}>{weekTotal} planned</span>
      </div>

      <div className={styles.strip} aria-hidden="true">
        {WEEK_DAYS.map((d) => {
          const count = posts.filter((p) => p.scheduledDate === d.iso).length;
          const isToday = "today" in d && d.today;
          return (
            <div
              key={d.iso}
              className={`${styles.dayCell} ${isToday ? styles.dayCellToday : ""}`}
            >
              <span className={styles.dayLetter}>{d.letter}</span>
              <span className={styles.dayNum}>{d.n}</span>
              <span className={styles.pipRow}>
                {count > 0 ? (
                  <span
                    className={`${styles.pip} ${isToday ? styles.pipToday : ""}`}
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.statValueSuccess}`}>
            {pubCount}
          </span>
          <span className={styles.statLabel}>Published</span>
        </div>
        <span className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={styles.statValue}>{draftCount}</span>
          <span className={styles.statLabel}>In draft</span>
        </div>
        <span className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.statValuePrimary}`}>
            {weekTotal}
          </span>
          <span className={styles.statLabel}>Planned</span>
        </div>
      </div>
    </div>
  );
}
