import { AppBar } from "@/components/ui/AppBar/AppBar";
import { KPI } from "@/components/ui/KPI/KPI";
import { POSTS } from "@/mocks/fixtures";
import styles from "./analytics.module.css";

const MONTH = "2026-05";
const WEEK_START = "2026-05-10"; // 7-day window end = today May 16

function kpiData() {
  const published = POSTS.filter(
    (p) => p.status === "pub" && p.scheduledDate?.startsWith(MONTH),
  ).length;
  const scheduled = POSTS.filter((p) => p.status === "sched").length;
  const inDraft = POSTS.filter((p) =>
    (["idea", "draft", "review"] as string[]).includes(p.status),
  ).length;
  const overdue = POSTS.filter((p) => p.status === "overdue").length;
  const pace7d = POSTS.filter(
    (p) =>
      p.status === "pub" &&
      p.scheduledDate != null &&
      p.scheduledDate >= WEEK_START,
  ).length;
  return { published, scheduled, inDraft, overdue, pace7d };
}

export default function AnalyticsPage() {
  const { published, scheduled, inDraft, overdue, pace7d } = kpiData();

  return (
    <div>
      <AppBar
        variant="prominent"
        kicker="Overview"
        title="Analytics"
        style={{ paddingTop: "var(--s-4)" }}
      />

      <div className={styles.content}>
        <section aria-label="Key metrics">
          <p className={styles.sectionLabel}>This month</p>
          <div className={styles.grid}>
            <KPI
              label="Published"
              value={published}
              unit=" posts"
              delta="+2 vs Apr"
              trend="up"
            />
            <KPI label="Scheduled" value={scheduled} unit=" upcoming" />
            <KPI
              label="In Draft"
              value={inDraft}
              unit=" posts"
              delta="-1 vs last wk"
              trend="down"
            />
            <KPI
              label="Overdue"
              value={overdue}
              trend={overdue === 0 ? "flat" : "down"}
            />
          </div>
        </section>

        <section aria-label="Pace">
          <p className={styles.sectionLabel}>Rolling 7 days</p>
          <div className={styles.grid}>
            <KPI
              label="Pace"
              value={pace7d}
              unit=" posts"
              delta="On track"
              trend="flat"
            />
            <KPI
              label="Avg / day"
              value={(pace7d / 7).toFixed(1)}
              unit=" posts"
            />
          </div>
        </section>

        <div className={styles.note}>
          <p>Real metrics sync when you connect platforms in Settings.</p>
        </div>
      </div>
    </div>
  );
}
