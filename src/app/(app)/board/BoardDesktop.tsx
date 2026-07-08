"use client";

import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
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
const STAGES: {
  value: PostStatus;
  label: string;
  color: string;
  emptyAction: string;
}[] = [
  {
    value: "idea",
    label: "Idea",
    color: "var(--st-idea-fg)",
    emptyAction: "New idea",
  },
  {
    value: "draft",
    label: "Drafting",
    color: "var(--st-draft-fg)",
    emptyAction: "New draft",
  },
  {
    value: "review",
    label: "Review",
    color: "var(--st-review-fg)",
    emptyAction: "New post",
  },
  {
    value: "sched",
    label: "Scheduled",
    color: "var(--st-sched-fg)",
    emptyAction: "Schedule post",
  },
  {
    value: "pub",
    label: "Published",
    color: "var(--st-pub-fg)",
    emptyAction: "New post",
  },
];

// Helper copy per lane
const EMPTY_COPY: Record<string, string> = {
  idea: "Capture a spark here. Every post starts as an idea.",
  draft:
    "Posts you start writing will show up here. Move an idea forward to begin a draft.",
  review: "Drafts ready for a final pass land here before scheduling.",
  sched: "Posts with a date and time queue up here, ready to publish.",
  pub: "Published posts live here. Nothing shipped yet.",
};

export function BoardDesktop() {
  const router = useRouter();
  const { posts } = usePosts();

  const total = posts.filter((p) => p.status !== "overdue").length;

  return (
    <PageSurface
      wide
      title="Board"
      subtitle={`${total} posts across ${STAGES.length} stages`}
    >
      <div className={styles.board}>
        {STAGES.map(({ value, label, color, emptyAction }) => {
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
                  <div className={styles.emptyLane}>
                    <span className={styles.emptyLaneIcon} aria-hidden="true">
                      <Pencil size={20} />
                    </span>
                    <p className={styles.emptyLaneTitle}>Nothing in {label}</p>
                    <p className={styles.emptyLaneDesc}>{EMPTY_COPY[value]}</p>
                    <button
                      type="button"
                      className={styles.emptyLaneBtn}
                      onClick={() => router.push("/post/new")}
                    >
                      <Plus size={14} />
                      {emptyAction}
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PageSurface>
  );
}
