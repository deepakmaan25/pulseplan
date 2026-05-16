import { AppBar } from "@/components/ui/AppBar/AppBar";
import { PostRow } from "@/components/post/PostRow";
import { POSTS } from "@/mocks/fixtures";
import styles from "./plan.module.css";

const TODAY = "2026-05-16";

interface WeekDay {
  date: string;
  label: string;
  shortLabel: string;
  isToday: boolean;
}

function getWeekDays(): WeekDay[] {
  // Week containing May 16, 2026 (Saturday): Mon May 11 – Sun May 17
  const weekStart = new Date("2026-05-11T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = d.toISOString().split("T")[0]!;
    return {
      date: iso,
      label: d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      shortLabel: d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      }),
      isToday: iso === TODAY,
    };
  });
}

export default function PlanPage() {
  const days = getWeekDays();

  return (
    <div>
      <AppBar
        variant="prominent"
        kicker="May 2026"
        title="This Week"
        style={{ paddingTop: "var(--s-4)" }}
      />

      <div className={styles.content}>
        {days.map((day) => {
          const posts = POSTS.filter((p) => p.scheduledDate === day.date);
          return (
            <section key={day.date} aria-label={day.label}>
              <div
                className={`${styles.dayHeader} ${day.isToday ? styles.dayHeaderToday : ""}`}
              >
                <span className={styles.dayLabel}>{day.label}</span>
                {day.isToday && (
                  <span className={styles.todayBadge}>Today</span>
                )}
              </div>
              {posts.length > 0 ? (
                <div className={styles.list}>
                  {posts.map((post) => (
                    <PostRow
                      key={post.id}
                      title={post.title}
                      time={post.time}
                      status={post.status}
                      pillar={post.pillar}
                      platform={post.platform}
                      postType={post.postType}
                      priority={post.priority}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyDay}>No posts scheduled</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
