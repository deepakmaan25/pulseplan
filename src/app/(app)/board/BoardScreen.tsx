"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { FilterChip } from "@/components/ui/chips/FilterChip";
import { BoardCard } from "@/components/post/BoardCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { usePosts } from "@/store/PostsContext";
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
  const router = useRouter();
  const { posts } = usePosts();

  const filtered = posts.filter((p) => p.status === active);
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

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((post) => (
            <BoardCard
              key={post.id}
              title={post.title}
              pillar={post.pillar}
              platform={post.platform}
              postType={post.postType}
              priority={post.priority}
              dayStamp={post.scheduledDate?.slice(5).replace("-", "/")}
              onClick={() => router.push(`/post/${post.id}`)}
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
