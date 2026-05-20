"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { KPI } from "@/components/ui/KPI/KPI";
import { usePosts } from "@/store/PostsContext";
import styles from "./analytics.module.css";

const TODAY = "2026-05-16";
const MONTH_PREFIX = "2026-05";
const WEEK_START = "2026-05-10";

const PLATFORM_LABELS: Record<string, string> = {
  ig: "Instagram",
  li: "LinkedIn",
  x: "X / Twitter",
  yt: "YouTube",
  th: "Threads",
};

const CADENCE_GOALS: Record<string, number> = {
  daily: 7,
  "5x": 5,
  "3x": 3,
  "2x": 2,
  weekly: 1,
};

const CADENCE_LABELS: Record<string, string> = {
  daily: "7× / week",
  "5x": "5× / week",
  "3x": "3× / week",
  "2x": "2× / week",
  weekly: "1× / week",
};

export function AnalyticsClient() {
  const { posts } = usePosts();
  const [weeklyGoal, setWeeklyGoal] = useState<{
    count: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pp2-onboarding");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { cadence?: string };
      const cadence = parsed.cadence ?? "";
      const count = CADENCE_GOALS[cadence];
      const label = CADENCE_LABELS[cadence];
      if (count !== undefined && label !== undefined) {
        setWeeklyGoal({ count, label });
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const stats = useMemo(() => {
    const published = posts.filter(
      (p) => p.status === "pub" && p.scheduledDate?.startsWith(MONTH_PREFIX),
    ).length;
    const scheduled = posts.filter((p) => p.status === "sched").length;
    const idea = posts.filter((p) => p.status === "idea").length;
    const inProgress = posts.filter(
      (p) => p.status === "draft" || p.status === "review",
    ).length;
    const overdue = posts.filter((p) => p.status === "overdue").length;
    const pace7d = posts.filter(
      (p) =>
        p.status === "pub" &&
        p.scheduledDate != null &&
        p.scheduledDate >= WEEK_START &&
        p.scheduledDate <= TODAY,
    ).length;

    const pillarMap = new Map<
      string,
      { name: string; color: string; count: number }
    >();
    posts.forEach((p) => {
      const entry = pillarMap.get(p.pillar.id);
      if (entry) {
        entry.count++;
      } else {
        pillarMap.set(p.pillar.id, {
          name: p.pillar.name,
          color: p.pillar.color,
          count: 1,
        });
      }
    });
    const pillars = [...pillarMap.values()].sort((a, b) => b.count - a.count);
    const maxPillarCount = Math.max(...pillars.map((p) => p.count), 1);

    const platformMap = new Map<string, number>();
    posts.forEach((p) => {
      platformMap.set(p.platform, (platformMap.get(p.platform) ?? 0) + 1);
    });
    const platforms = [...platformMap.entries()]
      .map(([key, count]) => ({
        key,
        label: PLATFORM_LABELS[key] ?? key,
        count,
      }))
      .sort((a, b) => b.count - a.count);
    const maxPlatformCount = Math.max(...platforms.map((p) => p.count), 1);

    return {
      published,
      scheduled,
      idea,
      inProgress,
      overdue,
      pace7d,
      pillars,
      platforms,
      maxPillarCount,
      maxPlatformCount,
    };
  }, [posts]);

  return (
    <div>
      <AppHeader
        variant="prominent"
        title="Analytics"
        style={{ paddingTop: "var(--s-4)" }}
      />

      <div className={styles.content}>
        {/* Pipeline */}
        <section aria-label="Content pipeline">
          <p className={styles.sectionLabel}>Pipeline</p>
          <div className={styles.pipelineRow}>
            <div className={styles.pipelineCell}>
              <span className={styles.pipelineCount}>{stats.idea}</span>
              <span className={styles.pipelineName}>Ideas</span>
            </div>
            <div className={styles.pipelineCell}>
              <span className={styles.pipelineCount}>{stats.inProgress}</span>
              <span className={styles.pipelineName}>In progress</span>
            </div>
            <div className={styles.pipelineCell}>
              <span className={styles.pipelineCount}>{stats.scheduled}</span>
              <span className={styles.pipelineName}>Scheduled</span>
            </div>
            <div className={styles.pipelineCell}>
              <span className={styles.pipelineCount}>{stats.published}</span>
              <span className={styles.pipelineName}>Published</span>
            </div>
            {stats.overdue > 0 && (
              <div
                className={`${styles.pipelineCell} ${styles.pipelineCellOverdue}`}
              >
                <span className={styles.pipelineCount}>{stats.overdue}</span>
                <span className={styles.pipelineName}>Overdue</span>
              </div>
            )}
          </div>
        </section>

        {/* Pace */}
        <section aria-label="Publishing pace">
          <p className={styles.sectionLabel}>Last 7 days</p>
          <div className={styles.grid}>
            <KPI
              label="Published"
              value={stats.pace7d}
              trend={
                stats.pace7d >= 3 ? "up" : stats.pace7d > 0 ? "flat" : "down"
              }
            />
            {weeklyGoal !== null ? (
              <KPI
                label="Goal"
                value={stats.pace7d}
                unit={` / ${weeklyGoal.count}`}
                delta={weeklyGoal.label}
                trend={
                  stats.pace7d >= weeklyGoal.count
                    ? "up"
                    : stats.pace7d > 0
                      ? "flat"
                      : "down"
                }
              />
            ) : (
              <KPI
                label="Daily avg"
                value={(stats.pace7d / 7).toFixed(1)}
                unit=" / day"
              />
            )}
          </div>
        </section>

        {/* Pillar breakdown */}
        {stats.pillars.length > 0 && (
          <section aria-label="Content pillar breakdown">
            <p className={styles.sectionLabel}>Content pillars</p>
            <div className={styles.breakdownList}>
              {stats.pillars.map(({ name, color, count }) => (
                <div key={name} className={styles.breakdownRow}>
                  <span
                    className={styles.breakdownDot}
                    style={{ background: color }}
                  />
                  <span className={styles.breakdownName}>{name}</span>
                  <div className={styles.breakdownBarTrack}>
                    <div
                      className={styles.breakdownBar}
                      style={{
                        width: `${(count / stats.maxPillarCount) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <span className={styles.breakdownCount}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Platform breakdown */}
        {stats.platforms.length > 0 && (
          <section aria-label="Platform breakdown">
            <p className={styles.sectionLabel}>Platforms</p>
            <div className={styles.breakdownList}>
              {stats.platforms.map(({ key, label, count }) => (
                <div key={key} className={styles.breakdownRow}>
                  <span className={styles.breakdownName}>{label}</span>
                  <div className={styles.breakdownBarTrack}>
                    <div
                      className={styles.breakdownBar}
                      style={{
                        width: `${(count / stats.maxPlatformCount) * 100}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                  <span className={styles.breakdownCount}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <p className={styles.emptyNote}>
            Add your first post idea to start tracking your pipeline.
          </p>
        )}

        <div className={styles.note}>
          <p>
            Engagement data appears here once you connect your platforms in
            Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
