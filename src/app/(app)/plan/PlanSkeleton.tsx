import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import styles from "./plan.module.css";

/**
 * Loading skeleton for the Plan week view. Mirrors the real layout (day
 * header + gap-separated post-row blocks) so the load→content swap doesn't
 * reflow.
 *
 * NOTE: currently DORMANT. Posts come from a synchronous mock context
 * (`usePosts`) with no async loading phase, so nothing renders this yet. When
 * the data layer becomes async (real backend), render <PlanSkeleton /> while
 * `isLoading` is true — it's keyed to the same `.day` / `.rows` / `.planRow`
 * classes as the live view.
 */
export function PlanSkeleton({ days = 3 }: { days?: number }) {
  return (
    <div className={styles.weekGroup} aria-hidden="true">
      {Array.from({ length: days }).map((_, i) => (
        <section key={i} className={styles.day}>
          <div className={styles.dayHeader}>
            <Skeleton width={110} height={15} />
            <Skeleton width={56} height={12} />
          </div>
          <div className={styles.rows}>
            {Array.from({ length: i === 0 ? 1 : 2 }).map((__, j) => (
              <div key={j} className={styles.planRow}>
                <Skeleton width={56} height={12} />
                <Skeleton
                  height={14}
                  style={{ flex: 1, maxWidth: "60%" }}
                  shape="line"
                />
                <Skeleton width={64} height={20} shape="rect" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
