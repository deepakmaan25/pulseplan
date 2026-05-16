import { AppBar } from "@/components/ui/AppBar/AppBar";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { PostRow } from "@/components/post/PostRow";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Bell } from "lucide-react";
import { POSTS } from "@/mocks/fixtures";
import styles from "./today.module.css";

const TODAY = "2026-05-16";

function formatKicker(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TodayPage() {
  const posts = POSTS.filter((p) => p.scheduledDate === TODAY);
  const overdue = POSTS.filter((p) => p.status === "overdue");

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
        {overdue.length > 0 && (
          <section aria-label="Overdue">
            <p className={styles.sectionLabel}>Overdue</p>
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
                />
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 ? (
          <section aria-label="Scheduled for today">
            <p className={styles.sectionLabel}>Scheduled</p>
            <div className={styles.list}>
              {posts.map((post) => (
                <PostRow
                  key={post.id}
                  title={post.title}
                  time={post.time}
                  status={post.status}
                  pillar={post.pillar}
                  platform={post.platform}
                  postType={post.postType}
                  priority={post.priority}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            icon="📅"
            title="Nothing today"
            description="Tap + to capture an idea or schedule a post."
          />
        )}
      </div>
    </div>
  );
}
