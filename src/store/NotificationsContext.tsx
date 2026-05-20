"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NOTIFICATIONS, type MockNotification } from "@/mocks/notifications";

export type NotificationWithRead = MockNotification & { read: boolean };

interface NotificationsCtx {
  notifications: NotificationWithRead[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const Ctx = createContext<NotificationsCtx | null>(null);

// n2 (streak) starts as already-read; n1 and n3 are unread
const INITIAL_READ = new Set(["n2"]);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(INITIAL_READ);

  const notifications = useMemo(
    () => NOTIFICATIONS.map((n) => ({ ...n, read: readIds.has(n.id) })),
    [readIds],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }, []);

  const value = useMemo(
    (): NotificationsCtx => ({
      notifications,
      unreadCount,
      markRead,
      markAllRead,
    }),
    [notifications, unreadCount, markRead, markAllRead],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications(): NotificationsCtx {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside <NotificationsProvider>",
    );
  return ctx;
}
