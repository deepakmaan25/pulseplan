export type NotificationType = "overdue" | "streak" | "reminder";

export interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  postId?: string;
  ts: string; // ISO timestamp
}

export const NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "overdue",
    title: "Post overdue",
    body: '"Consistency vs quality" missed its May 12 date.',
    postId: "ov1",
    ts: "2026-05-12T14:00:00",
  },
  {
    id: "n2",
    type: "streak",
    title: "3-day streak",
    body: "You've published 3 days in a row. Keep it up!",
    ts: "2026-05-14T08:00:00",
  },
  {
    id: "n3",
    type: "reminder",
    title: "Upcoming post tomorrow",
    body: '"The framework I use to create 30 days of content" is scheduled for 10:00 AM.',
    postId: "tm1",
    ts: "2026-05-16T20:00:00",
  },
];
