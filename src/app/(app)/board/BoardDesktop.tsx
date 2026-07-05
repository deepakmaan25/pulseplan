"use client";

import { useRouter } from "next/navigation";
import { usePosts } from "@/store/PostsContext";
import { PageSurface } from "@/components/PageSurface/PageSurface";
import { BoardCard } from "@/components/post/BoardCard";
import type { PostStatus } from "@/components/ui/chips/StatusChip";
import styles from "./boardDesktop.module.css";

function formatDayStamp(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Overdue is a derived callout, not a kanban stage — excluded from columns.
const STAGES: { value: PostStatus; label: string; color: string }[] = [
  { value: "idea", label: "Idea", color: "var(--st-idea-fg)" },
  { value: "draft", label: "Drafting", color: "var(--st-draft-fg)" },
  { value: "review", label: "Review", color: "var(--st-review-fg)" },
  { value: "sched", label: "Scheduled", color: "var(--st-sched-fg)" },
  { value: "pub", label: "Published", color: "var(--st-pub-fg)" },
];

export function BoardDesktop() {
  const router = useRouter();
  const { posts } = usePosts();

  const total = posts.filter((p) => p.status !== "overdue").length;

  return (
    <PageSurface
      title="Board"
      subtitle={`${total} posts across ${STAGES.length} stages`}
    >
      <div className={styles.board}>
        {STAGES.map(({ value, label, color }) => {
          const cards = posts.filter((p) => p.status === value);
          return (
            <section
              key={value}
              className={styles.column}
              aria-label={`${label} — ${cards.length} posts`}
            >
              <div className={styles.columnHead}>
                <span
                  className={styles.columnDot}
                  style={{ background: color }}
                  aria-hidden="true"
                />
                <span className={styles.columnTitle}>{label}</span>
                <span className={styles.columnCount}>{cards.length}</span>
              </div>
              <div className={styles.columnBody}>
                {cards.length > 0 ? (
                  cards.map((post) => (
                    <BoardCard
                      key={post.id}
                      title={post.title}
                      pillar={post.pillar}
                      platform={post.platform}
                      status={post.status}
                      postType={post.postType}
                      priority={post.priority}
                      dayStamp={formatDayStamp(post.scheduledDate)}
                      onClick={() => router.push(`/post/${post.id}`)}
                    />
                  ))
                ) : (
                  <p className={styles.emptyColumn}>Nothing here yet</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PageSurface>
  );
}
