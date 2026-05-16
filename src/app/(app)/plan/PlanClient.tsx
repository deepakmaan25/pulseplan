"use client";

import { useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { PostRow } from "@/components/post/PostRow";
import { usePosts } from "@/store/PostsContext";
import styles from "./plan.module.css";

const TODAY = "2026-05-16";

interface WeekDay {
  date: string;
  label: string;
  isToday: boolean;
}

function getWeekDays(): WeekDay[] {
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
      isToday: iso === TODAY,
    };
  });
}

function weekRangeKicker(days: WeekDay[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return "This Week";
  const fmt = (d: WeekDay) =>
    new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  return `${fmt(first)} – ${fmt(last)}`;
}

export function PlanClient() {
  const router = useRouter();
  const { posts } = usePosts();
  const days = getWeekDays();

  function openPost(id: string) {
    router.push(`/post/${id}`);
  }

  return (
    <div>
      <AppBar
        variant="prominent"
        kicker={weekRangeKicker(days)}
        title="This Week"
        style={{ paddingTop: "var(--s-4)" }}
      />

      <div className={styles.content}>
        {days.map((day) => {
          const dayPosts = posts.filter((p) => p.scheduledDate === day.date);
          return (
            <section key={day.date} aria-label={day.label}>
              <div
                className={`${styles.dayHeader} ${day.isToday ? styles.dayHeaderToday : ""}`}
              >
                <span className={styles.dayLabel}>{day.label}</span>
                {day.isToday && (
                  <span className={styles.todayBadge}>Today</span>
                )}
                {dayPosts.length > 0 && (
                  <span className={styles.countBadge}>{dayPosts.length}</span>
                )}
              </div>
              {dayPosts.length > 0 ? (
                <div className={styles.list}>
                  {dayPosts.map((post) => (
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
              ) : (
                <p className={styles.emptyDay}>
                  {day.isToday ? "Nothing planned — tap + to add" : "Free day"}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
