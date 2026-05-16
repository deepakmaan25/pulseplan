"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { PostRow } from "@/components/post/PostRow";
import { usePosts } from "@/store/PostsContext";
import type { MockPost } from "@/mocks/fixtures";
import styles from "./today.module.css";

const TODAY = "2026-05-16";

const PRIORITY_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

function sortByPriority(posts: MockPost[]): MockPost[] {
  return [...posts].sort((a, b) => {
    const pa = a.priority ? (PRIORITY_ORDER[a.priority] ?? 3) : 3;
    const pb = b.priority ? (PRIORITY_ORDER[b.priority] ?? 3) : 3;
    if (pa !== pb) return pa - pb;
    // Then by scheduled time (ascending)
    return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
  });
}

function formatKicker(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function TodayClient() {
  const router = useRouter();
  const { posts } = usePosts();

  const overdue = sortByPriority(posts.filter((p) => p.status === "overdue"));
  const todayPosts = sortByPriority(
    posts.filter((p) => p.scheduledDate === TODAY && p.status !== "overdue"),
  );
  const hasAnything = overdue.length > 0 || todayPosts.length > 0;

  function openPost(id: string) {
    router.push(`/post/${id}`);
  }

  return (
    <div>
      <AppBar
        variant="prominent"
        kicker={formatKicker(TODAY)}
        title="Today"
        style={{ paddingTop: "var(--s-4)" }}
        trailing={
          <IconButton
            icon={<Bell size={20} />}
            label="Notifications"
            variant="ghost"
            size={40}
          />
        }
      />

      <div className={styles.content}>
        {!hasAnything && (
          <EmptyState
            icon="✨"
            title="You're all clear"
            description="Nothing scheduled today. Tap + to capture an idea."
          />
        )}

        {overdue.length > 0 && (
          <section aria-label="Overdue posts">
            <p
              className={`${styles.sectionLabel} ${styles.sectionLabelDanger}`}
            >
              {overdue.length === 1
                ? "1 post overdue"
                : `${overdue.length} posts overdue`}
            </p>
            <div className={styles.list}>
              {overdue.map((post) => (
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
          </section>
        )}

        {todayPosts.length > 0 && (
          <section aria-label="Today's posts">
            <p className={styles.sectionLabel}>
              {todayPosts.length === 1
                ? "1 post today"
                : `${todayPosts.length} posts today`}
            </p>
            <div className={styles.list}>
              {todayPosts.map((post) => (
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
          </section>
        )}
      </div>
    </div>
  );
}
