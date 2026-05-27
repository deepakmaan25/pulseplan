"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { Segmented } from "@/components/ui/Segmented/Segmented";
import { usePosts } from "@/store/PostsContext";
import styles from "./analytics.module.css";

type Period = "7d" | "28d" | "90d";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "28d", label: "28d" },
  { value: "90d", label: "90d" },
];

const SPARKLINES: Record<Period, number[]> = {
  "7d": [28, 32, 30, 38, 35, 42, 48],
  "28d": [18, 22, 20, 24, 22, 28, 26, 30, 28, 34, 32, 36, 34, 38, 36, 40, 38, 44, 42, 46, 44, 48, 46, 50, 48, 52, 50, 54],
  "90d": [5, 8, 7, 10, 9, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19, 22, 24, 22, 26, 24, 28, 30, 28, 32, 30, 34, 36, 34, 38, 40, 42],
};

const HERO: Record<Period, { value: string; delta: string; positive: boolean }> = {
  "7d": { value: "48.2K", delta: "+12%", positive: true },
  "28d": { value: "184K", delta: "+8%", positive: true },
  "90d": { value: "520K", delta: "+24%", positive: true },
};

const KPI_DATA: Record<
  Period,
  { engagement: string; followers: string; saved: string; avgWatch: string }
> = {
  "7d": { engagement: "8.4%", followers: "+342", saved: "1.2K", avgWatch: "72%" },
  "28d": { engagement: "7.9%", followers: "+1.1K", saved: "4.8K", avgWatch: "68%" },
  "90d": { engagement: "8.1%", followers: "+3.4K", saved: "14.2K", avgWatch: "71%" },
};

const MOCK_REACH = [12400, 9800, 7200, 5100, 3900];

const PLATFORM_ABBR: Record<string, string> = {
  ig: "IG",
  li: "LI",
  x: "X",
  yt: "YT",
  th: "TH",
};

const PLATFORM_LABELS: Record<string, string> = {
  ig: "Instagram",
  li: "LinkedIn",
  x: "X / Twitter",
  yt: "YouTube",
  th: "Threads",
};

function formatReach(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function Sparkline({ points }: { points: number[] }) {
  const W = 160;
  const H = 40;
  const PAD = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const n = points.length;
  const xs = points.map((_, i) => (i / (n - 1)) * W);
  const ys = points.map(
    (v) => H - PAD - ((v - min) / range) * (H - PAD * 2),
  );
  const linePoints = xs.map((x, i) => `${x.toFixed(1)},${ys[i]!.toFixed(1)}`).join(" ");
  const areaPoints = `0,${H} ${linePoints} ${W},${H}`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className={styles.sparkline}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spkFillAnalytics" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spkFillAnalytics)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AnalyticsClient() {
  const { posts } = usePosts();
  const [period, setPeriod] = useState<Period>("7d");

  const hero = HERO[period];
  const kpi = KPI_DATA[period];
  const sparkPoints = SPARKLINES[period];

  const topPosts = useMemo(() => {
    const pubPosts = posts.filter((p) => p.status === "pub");
    return pubPosts.slice(0, 5).map((p, i) => ({
      ...p,
      reach: MOCK_REACH[i] ?? (5 - i) * 800 + 400,
    }));
  }, [posts]);

  const { pillars, platforms, maxPillarCount, maxPlatformCount } =
    useMemo(() => {
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

      return {
        pillars,
        platforms,
        maxPillarCount: Math.max(...pillars.map((p) => p.count), 1),
        maxPlatformCount: Math.max(...platforms.map((p) => p.count), 1),
      };
    }, [posts]);

  return (
    <div className={styles.screen}>
      <AppHeader
        variant="prominent"
        title="Analytics"
        style={{ paddingTop: "var(--s-4)" }}
      />

      {/* Period picker */}
      <div className={styles.periodBar}>
        <Segmented
          options={PERIOD_OPTIONS}
          value={period}
          onChange={(v) => setPeriod(v)}
          ariaLabel="Analytics period"
          size="sm"
        />
      </div>

      <div className={styles.content}>
        {/* Hero card — dark inverted */}
        <div className={styles.heroCard} aria-label={`Total reach ${hero.value}`}>
          <p className={styles.heroKicker}>Total reach</p>
          <div className={styles.heroRow}>
            <span className={styles.heroValue}>{hero.value}</span>
            <span
              className={`${styles.heroDelta} ${hero.positive ? styles.heroDeltaPos : styles.heroDeltaNeg}`}
            >
              {hero.delta}
            </span>
          </div>
          <Sparkline points={sparkPoints} />
        </div>

        {/* 2×2 KPI grid */}
        <div className={styles.kpiGrid} aria-label="Key metrics">
          <div className={styles.kpiCell}>
            <span className={styles.kpiValue}>{kpi.engagement}</span>
            <span className={styles.kpiLabel}>Engagement</span>
          </div>
          <div className={styles.kpiCell}>
            <span className={styles.kpiValue}>{kpi.followers}</span>
            <span className={styles.kpiLabel}>Followers</span>
          </div>
          <div className={styles.kpiCell}>
            <span className={styles.kpiValue}>{kpi.saved}</span>
            <span className={styles.kpiLabel}>Saved</span>
          </div>
          <div className={styles.kpiCell}>
            <span className={styles.kpiValue}>{kpi.avgWatch}</span>
            <span className={styles.kpiLabel}>Avg watch</span>
          </div>
        </div>

        {/* Top Posts */}
        {topPosts.length > 0 && (
          <section aria-label="Top posts">
            <p className={styles.sectionLabel}>Top posts</p>
            <div className={styles.topList}>
              {topPosts.map((p, i) => (
                <div key={p.id} className={styles.topRow}>
                  <span className={styles.topRank}>{i + 1}</span>
                  <span className={styles.topPlatform}>
                    {PLATFORM_ABBR[p.platform] ?? p.platform}
                  </span>
                  <span className={styles.topTitle}>{p.title}</span>
                  <span className={styles.topReach}>{formatReach(p.reach)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Content pillars */}
        {pillars.length > 0 && (
          <section aria-label="Content pillar breakdown">
            <p className={styles.sectionLabel}>Content pillars</p>
            <div className={styles.breakdownList}>
              {pillars.map(({ name, color, count }) => (
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
                        width: `${(count / maxPillarCount) * 100}%`,
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

        {/* Platforms */}
        {platforms.length > 0 && (
          <section aria-label="Platform breakdown">
            <p className={styles.sectionLabel}>Platforms</p>
            <div className={styles.breakdownList}>
              {platforms.map(({ key, label, count }) => (
                <div key={key} className={styles.breakdownRow}>
                  <span className={styles.breakdownName}>{label}</span>
                  <div className={styles.breakdownBarTrack}>
                    <div
                      className={styles.breakdownBar}
                      style={{
                        width: `${(count / maxPlatformCount) * 100}%`,
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
      </div>
    </div>
  );
}
