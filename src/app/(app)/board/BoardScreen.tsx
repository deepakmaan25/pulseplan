"use client";

import { useState } from "react";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { FilterChip } from "@/components/ui/chips/FilterChip";
import { BoardCard } from "@/components/post/BoardCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { postsByStatus } from "@/mocks/fixtures";
import type { PostStatus } from "@/components/ui/chips/StatusChip";
import styles from "./board.module.css";

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
  const posts = postsByStatus(active);
  const activeLabel = STATUSES.find((s) => s.value === active)?.label ?? active;

  return (
    <div>
      <AppBar
        variant="compact"
        title="Board"
        style={{ paddingTop: "var(--s-4)" }}
      />

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

      {posts.length > 0 ? (
        <div className={styles.grid}>
          {posts.map((post) => (
            <BoardCard
              key={post.id}
              title={post.title}
              pillar={post.pillar}
              platform={post.platform}
              postType={post.postType}
              priority={post.priority}
              dayStamp={post.scheduledDate?.slice(5).replace("-", "/")}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🗂️"
          title={`No ${activeLabel.toLowerCase()} posts`}
          description="Capture an idea with the + button."
        />
      )}
    </div>
  );
}
