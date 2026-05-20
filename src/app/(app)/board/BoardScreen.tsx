"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { FilterChip } from "@/components/ui/chips/FilterChip";
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

const STATUSES: { value: PostStatus; label: string }[] = [
  { value: "idea", label: "Ideas" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "sched", label: "Scheduled" },
  { value: "pub", label: "Published" },
  { value: "overdue", label: "Overdue" },
];

export function BoardScreen() {
  const [active, setActive] = useState<PostStatus>("draft");
  const router = useRouter();
  const { posts } = usePosts();

  const filtered = posts.filter((p) => p.status === active);
  const activeLabel = STATUSES.find((s) => s.value === active)?.label ?? active;

  return (
    <div>
      <AppHeader title="Board" style={{ paddingTop: "var(--s-4)" }} />

      <div className={styles.filterWrapper}>
        <div
          className={styles.filterRow}
          role="group"
          aria-label="Filter by status"
        >
          {STATUSES.map(({ value, label }) => (
            <FilterChip
              key={value}
              label={label}
              active={active === value}
              onClick={() => setActive(value)}
            />
          ))}
        </div>
      </div>

      {filtered.length > 0 && (
        <p className={styles.countLine}>
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </p>
      )}

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
          icon="🗂️"
          title={`No ${activeLabel.toLowerCase()} yet`}
          description={
            active === "idea"
              ? "Tap + to capture your first post idea."
              : active === "overdue"
                ? "You're all caught up — nothing is overdue."
                : `Move a post to ${activeLabel.toLowerCase()} to see it here.`
          }
        />
      )}
    </div>
  );
}
