"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ToneIcon } from "@/components/ui/ToneIcon/ToneIcon";
import { BoardCard } from "@/components/post/BoardCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { usePosts } from "@/store/PostsContext";
import type { PostStatus } from "@/components/ui/chips/StatusChip";
import styles from "./board.module.css";

function formatDayStamp(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Overdue is a derived callout state, not a kanban stage — excluded from rail
const STAGES: { value: PostStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "draft", label: "Drafting" },
  { value: "review", label: "Review" },
  { value: "sched", label: "Scheduled" },
  { value: "pub", label: "Published" },
];

export function BoardScreen() {
  const [active, setActive] = useState<PostStatus>("draft");
  const router = useRouter();
  const { posts } = usePosts();

  const filtered = posts.filter((p) => p.status === active);
  const activeLabel = STAGES.find((s) => s.value === active)?.label ?? active;

  return (
    <div>
      <AppHeader title="Board" style={{ paddingTop: "var(--s-4)" }} />

      {/* Stage rail with counts */}
      <div className={styles.railWrapper}>
        <div className={styles.rail} role="tablist" aria-label="Content stages">
          {STAGES.map(({ value, label }) => {
            const count = posts.filter((p) => p.status === value).length;
            const isActive = active === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(value)}
                className={`${styles.railCell} ${isActive ? styles.railCellActive : ""}`}
              >
                <span className={styles.railLabel}>{label}</span>
                <span
                  className={`${styles.railCount} ${isActive ? styles.railCountActive : ""}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active column header */}
      <div className={styles.columnHeader}>
        <span className={styles.columnDot} aria-hidden="true" />
        <span className={styles.columnTitle}>{activeLabel}</span>
        <span className={styles.columnCount}>{filtered.length}</span>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((post) => (
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
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <ToneIcon icon={<Archive size={18} />} tone="neutral" size={36} />
          }
          title={`No ${activeLabel.toLowerCase()} yet`}
          description={
            active === "idea"
              ? "Tap + to capture your first post idea."
              : `Move a post to ${activeLabel.toLowerCase()} to see it here.`
          }
        />
      )}
    </div>
  );
}
