"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ToneIcon } from "@/components/ui/ToneIcon/ToneIcon";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import { OverdueCallout } from "@/components/post/OverdueCallout";
import { PostRow } from "@/components/post/PostRow";
import { WeekHero } from "@/components/today/WeekHero";
import type { MockPost } from "@/mocks/fixtures";
import { useTodayData } from "./useTodayData";
import styles from "./today.module.css";

function formatDayStamp(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function JustShippedCard({
  post,
  onClick,
}: {
  post: MockPost;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.shippedCard} pp2-press`}
      onClick={onClick}
      aria-label={`Just shipped: ${post.title}. View insights.`}
    >
      <PlatformChip platform={post.platform} size="sm" showLabel={false} />
      <span className={styles.shippedTitle}>{post.title}</span>
      {post.scheduledDate ? (
        <span className={styles.shippedDate}>
          {formatDayStamp(post.scheduledDate)}
        </span>
      ) : null}
      <span className={styles.shippedCta} aria-hidden="true">
        Insights →
      </span>
    </button>
  );
}

export function TodayMobile() {
  const router = useRouter();
  const {
    posts,
    overdue,
    todayPosts,
    upNext,
    needsEyes,
    justShipped,
    hasToday,
    hasOther,
    greetingSub,
  } = useTodayData();

  const openPost = (id: string) => router.push(`/post/${id}`);

  return (
    <div>
      <AppHeader showGreeting greetingSub={greetingSub} />

      <div className={styles.content}>
        <WeekHero posts={posts} />

        {!hasToday && !hasOther && (
          <EmptyState
            icon={
              <ToneIcon
                icon={<Sparkles size={18} />}
                tone="primary"
                size={36}
              />
            }
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
            <div className={styles.calloutList}>
              {overdue.map((post) => (
                <OverdueCallout
                  key={post.id}
                  title={post.title}
                  onTap={() => openPost(post.id)}
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

        {upNext.length > 0 && (
          <section aria-label="Up next">
            <p className={styles.sectionLabel}>Up next</p>
            <div className={styles.list}>
              {upNext.map((post) => (
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

        {needsEyes.length > 0 && (
          <section aria-label="Needs your eyes">
            <p className={styles.sectionLabel}>Needs your eyes</p>
            <div className={styles.list}>
              {needsEyes.map((post) => (
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

        {justShipped && (
          <section aria-label="Just shipped">
            <p className={styles.sectionLabel}>Just shipped</p>
            <JustShippedCard
              post={justShipped}
              onClick={() => router.push("/analytics" as never)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
