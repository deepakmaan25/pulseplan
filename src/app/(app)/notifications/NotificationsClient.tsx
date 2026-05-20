"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import {
  useNotifications,
  type NotificationWithRead,
} from "@/store/NotificationsContext";
import styles from "./notifications.module.css";

const TYPE_ICONS: Record<string, string> = {
  overdue: "⚠️",
  streak: "🔥",
  reminder: "🔔",
};

function formatTs(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface NotifItemProps {
  notif: NotificationWithRead;
  onTap: () => void;
}

function NotifItem({ notif, onTap }: NotifItemProps) {
  const tappable = Boolean(notif.postId);
  return (
    <button
      type="button"
      onClick={tappable ? onTap : undefined}
      className={[
        styles.item,
        tappable ? styles.itemTappable : "",
        !notif.read ? styles.itemUnread : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={notif.title}
    >
      {!notif.read ? (
        <span className={styles.unreadDot} aria-label="Unread" />
      ) : (
        <span className={styles.unreadDotHidden} aria-hidden="true" />
      )}
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>
          {TYPE_ICONS[notif.type] ?? "🔔"} {notif.title}
        </p>
        <p className={styles.itemText}>{notif.body}</p>
        <p className={styles.itemTime}>{formatTs(notif.ts)}</p>
      </div>
    </button>
  );
}

export function NotificationsClient() {
  const router = useRouter();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  function handleTap(notif: NotificationWithRead) {
    markRead(notif.id);
    if (notif.postId) {
      router.push(`/post/${notif.postId}`);
    }
  }

  const allRead = unreadCount === 0;

  return (
    <div>
      <div className={styles.header} style={{ paddingTop: "var(--s-4)" }}>
        <IconButton
          icon={<ArrowLeft size={20} />}
          label="Back"
          onClick={() => router.back()}
          size={40}
        />
        <h1 className={styles.headerTitle}>Notifications</h1>
        <button
          type="button"
          className={styles.markAllBtn}
          onClick={markAllRead}
          disabled={allRead}
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔔</span>
          <p className={styles.emptyTitle}>No notifications</p>
          <p className={styles.emptyDesc}>
            You&apos;ll see overdue alerts and reminders here.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map((notif) => (
            <NotifItem
              key={notif.id}
              notif={notif}
              onTap={() => handleTap(notif)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
