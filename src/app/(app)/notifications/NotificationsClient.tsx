"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Bell, Flame } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { ToneIcon } from "@/components/ui/ToneIcon/ToneIcon";
import {
  useNotifications,
  type NotificationWithRead,
} from "@/store/NotificationsContext";
import type { NotificationType } from "@/mocks/notifications";
import styles from "./notifications.module.css";

function notifIcon(type: NotificationType) {
  switch (type) {
    case "overdue":
      return <ToneIcon icon={<AlertCircle size={16} />} tone="error" size={32} />;
    case "streak":
      return <ToneIcon icon={<Flame size={16} />} tone="warning" size={32} />;
    case "reminder":
    default:
      return <ToneIcon icon={<Bell size={16} />} tone="primary" size={32} />;
  }
}

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
      <div className={styles.itemIcon}>{notifIcon(notif.type)}</div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{notif.title}</p>
        <p className={styles.itemText}>{notif.body}</p>
        <p className={styles.itemTime}>{formatTs(notif.ts)}</p>
      </div>
      {!notif.read && (
        <span className={styles.unreadDot} aria-label="Unread" />
      )}
    </button>
  );
}

// Group notifications into buckets
const TODAY_DATE = "2026-05-16";
const WEEK_START = "2026-05-10";

function getGroup(ts: string): "today" | "week" | "earlier" {
  const date = ts.slice(0, 10);
  if (date === TODAY_DATE) return "today";
  if (date >= WEEK_START) return "week";
  return "earlier";
}

export function NotificationsClient() {
  const router = useRouter();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  function handleTap(notif: NotificationWithRead) {
    markRead(notif.id);
    if (notif.postId) {
      router.push(`/post/${notif.postId}` as never);
    }
  }

  const allRead = unreadCount === 0;

  const groups: { key: string; label: string; items: NotificationWithRead[] }[] =
    [
      {
        key: "today",
        label: "Today",
        items: notifications.filter((n) => getGroup(n.ts) === "today"),
      },
      {
        key: "week",
        label: "This week",
        items: notifications.filter((n) => getGroup(n.ts) === "week"),
      },
      {
        key: "earlier",
        label: "Earlier",
        items: notifications.filter((n) => getGroup(n.ts) === "earlier"),
      },
    ].filter((g) => g.items.length > 0);

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
          <ToneIcon icon={<Bell size={22} />} tone="neutral" size={48} />
          <p className={styles.emptyTitle}>No notifications</p>
          <p className={styles.emptyDesc}>
            You&apos;ll see overdue alerts and reminders here.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {groups.map((group) => (
            <div key={group.key}>
              <p className={styles.groupLabel}>{group.label}</p>
              {group.items.map((notif) => (
                <NotifItem
                  key={notif.id}
                  notif={notif}
                  onTap={() => handleTap(notif)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
