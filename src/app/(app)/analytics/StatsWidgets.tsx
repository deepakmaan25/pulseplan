import { useMemo } from "react";
import styles from "./analytics.module.css";

/* ── Best time to post ─────────────────────────────────────────────
   7-day engagement mini-chart. Peak days rendered in the brand accent,
   the rest muted. Data is stubbed (mock analytics). */

const BEST_TIME_DAYS = [
  { day: "M", weight: 0.42, peak: false },
  { day: "T", weight: 0.88, peak: true },
  { day: "W", weight: 0.5, peak: false },
  { day: "T", weight: 0.92, peak: true },
  { day: "F", weight: 0.6, peak: false },
  { day: "S", weight: 0.26, peak: false },
  { day: "S", weight: 0.2, peak: false },
];

export function BestTimeToPost() {
  return (
    <div className={styles.insightCard}>
      <p className={styles.sectionLabel}>Best time to post</p>
      <p className={styles.bestTimeValue}>
        9:00<span className={styles.bestTimeMeridiem}>AM</span>
      </p>
      <p className={styles.bestTimeSub}>
        Tuesdays &amp; Thursdays see your highest engagement
      </p>
      <div className={styles.bestTimeBars} aria-hidden="true">
        {BEST_TIME_DAYS.map(({ day, weight, peak }, i) => (
          <div key={i} className={styles.bestTimeBarCol}>
            <div
              className={`${styles.bestTimeBar} ${peak ? styles.bestTimeBarPeak : ""}`}
              style={{ height: `${Math.round(weight * 100)}%` }}
            />
            <span className={styles.bestTimeDay}>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Posting activity heatmap ──────────────────────────────────────
   GitHub-style contribution grid: 7 rows (days) × 12 columns (weeks).
   Deterministic pseudo-random intensity so it's stable across renders
   (no hydration mismatch). Data is stubbed. */

const HEAT_ROWS = ["M", "T", "W", "T", "F", "S", "S"];
const HEAT_WEEKS = 12;

function intensityFor(row: number, week: number): number {
  // deterministic hash → 0..4
  const h = (row * 31 + week * 17 + ((row * week) % 7) * 13) % 11;
  if (h < 3) return 0;
  if (h < 5) return 1;
  if (h < 7) return 2;
  if (h < 9) return 3;
  return 4;
}

export function PostingActivity() {
  const cells = useMemo(
    () =>
      HEAT_ROWS.map((_, r) =>
        Array.from({ length: HEAT_WEEKS }, (__, w) => intensityFor(r, w)),
      ),
    [],
  );

  return (
    <div className={styles.insightCard}>
      <div className={styles.insightHead}>
        <p className={styles.sectionLabel} style={{ margin: 0 }}>
          Posting activity
        </p>
        <span className={styles.insightMeta}>Last 12 weeks</span>
      </div>
      <div
        className={styles.heatGrid}
        role="img"
        aria-label="Posting activity over the last 12 weeks"
      >
        {cells.map((rowCells, r) => (
          <div key={r} className={styles.heatRow}>
            <span className={styles.heatRowLabel} aria-hidden="true">
              {HEAT_ROWS[r]}
            </span>
            {rowCells.map((level, w) => (
              <span
                key={w}
                className={styles.heatCell}
                data-level={level}
                aria-hidden="true"
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.heatLegend} aria-hidden="true">
        <span>Less</span>
        <span className={styles.heatCell} data-level={0} />
        <span className={styles.heatCell} data-level={1} />
        <span className={styles.heatCell} data-level={2} />
        <span className={styles.heatCell} data-level={3} />
        <span className={styles.heatCell} data-level={4} />
        <span>More</span>
      </div>
    </div>
  );
}
