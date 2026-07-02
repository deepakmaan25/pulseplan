"use client";

import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { PostRow } from "@/components/post/PostRow";
import { OverdueCallout } from "@/components/post/OverdueCallout";
import { WeekHero } from "@/components/today/WeekHero";
import { PILLARS, type MockPost } from "@/mocks/fixtures";
import { useTodayData } from "./useTodayData";
import shared from "./today.module.css";
import styles from "./todayDesktop.module.css";

/** Count posts per pillar for the "This week's mix" card. */
function pillarMix(posts: MockPost[]) {
  const counts = new Map<string, number>();
  for (const p of posts) {
    counts.set(p.pillar.id, (counts.get(p.pillar.id) ?? 0) + 1);
  }
  const total = posts.length || 1;
  return PILLARS.map((pillar) => {
    const count = counts.get(pillar.id) ?? 0;
    return { pillar, count, frac: count / total };
  }).sort((a, b) => b.count - a.count);
}

export function TodayDesktop() {
  const router = useRouter();
  const { posts, overdue, todayPosts, upNext, greetingSub } = useTodayData();

  const openPost = (id: string) => router.push(`/post/${id}`);
  const mix = pillarMix(posts);
  const weekTotal = posts.length;

  return (
    <div className={styles.page}>
      <AppHeader showGreeting greetingSub={greetingSub} />

      <div className={styles.grid}>
        {/* ── Left rail: summary ─────────────────────────────── */}
        <aside className={styles.rail}>
          <WeekHero posts={posts} />

          {overdue.length > 0 && (
            <section aria-label="Overdue posts">
              <p
                className={`${shared.sectionLabel} ${shared.sectionLabelDanger}`}
              >
                {overdue.length === 1
                  ? "1 post overdue"
                  : `${overdue.length} posts overdue`}
              </p>
              <div className={shared.calloutList}>
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

          {/* This week's mix */}
          <section className={styles.card} aria-label="This week's pillar mix">
            <div className={styles.cardHead}>
              <span className={styles.cardKicker}>This week&rsquo;s mix</span>
              <span className={styles.cardMeta}>{weekTotal} posts</span>
            </div>
            <div className={styles.mixList}>
              {mix.map(({ pillar, count, frac }) => (
                <div key={pillar.id} className={styles.mixRow}>
                  <div className={styles.mixTop}>
                    <span className={styles.mixName}>
                      <span
                        className={styles.mixDot}
                        style={{ background: pillar.color }}
                        aria-hidden="true"
                      />
                      {pillar.name}
                    </span>
                    <span className={styles.mixCount}>{count}</span>
                  </div>
                  <div className={styles.mixTrack}>
                    <div
                      className={styles.mixFill}
                      style={{
                        width: `${Math.round(frac * 100)}%`,
                        background: pillar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Streak */}
          <section className={styles.streak} aria-label="Publishing streak">
            <div className={styles.streakText}>
              <span className={styles.streakValue}>
                24 <span className={styles.streakUnit}>days</span>
              </span>
              <span className={styles.streakSub}>
                Publishing streak — your best yet
              </span>
            </div>
            <span className={styles.streakBadge} aria-hidden="true">
              <Flame size={20} />
            </span>
          </section>
        </aside>

        {/* ── Right: schedule ────────────────────────────────── */}
        <main className={styles.main}>
          <div className={styles.mainHead}>
            <h2 className={styles.mainTitle}>Today&rsquo;s schedule</h2>
            <span className={styles.mainMeta}>
              {todayPosts.length} {todayPosts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {todayPosts.length > 0 ? (
            <div className={shared.list}>
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
          ) : (
            <p className={styles.emptyLine}>Nothing scheduled for today.</p>
          )}

          {upNext.length > 0 && (
            <section className={styles.upNext} aria-label="Up next this week">
              <div className={styles.mainHead}>
                <h2 className={styles.mainTitle}>Up next this week</h2>
                <span className={styles.viewAll}>View all</span>
              </div>
              <div className={shared.list}>
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
        </main>
      </div>
    </div>
  );
}
