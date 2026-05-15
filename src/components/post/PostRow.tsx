"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { ChevronRight } from "lucide-react";
import { StatusChip, type PostStatus } from "../ui/chips/StatusChip";
import { PillarChip } from "../ui/chips/PillarChip";
import { PlatformChip, type Platform } from "../ui/chips/PlatformChip";
import { PriorityChip, type Priority } from "../ui/chips/PriorityChip";
import styles from "./PostRow.module.css";

export interface PostRowProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  title: string;
  time?: string;
  reminderHint?: string;
  status: PostStatus;
  pillar: { name: string; color: string };
  platform: Platform;
  postType?: string;
  priority?: Priority;
  type?: "button" | "submit" | "reset";
}

export const PostRow = forwardRef<HTMLButtonElement, PostRowProps>(
  function PostRow(
    {
      title,
      time,
      reminderHint,
      status,
      pillar,
      platform,
      postType,
      priority,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        data-state={status}
        className={`${styles.row} pp2-press ${className ?? ""}`}
        {...rest}
      >
        <span className={styles.stripe} aria-hidden="true" />
        <div className={styles.time}>
          <span className={styles.timeMain}>{time ?? "—"}</span>
          {reminderHint ? (
            <span className={styles.timeHint}>{reminderHint}</span>
          ) : null}
        </div>
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.chips}>
            <PlatformChip platform={platform} size="sm" showLabel={false} />
            {postType ? (
              <span
                style={{
                  font: "var(--t-mono)",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--ls-label)",
                }}
              >
                {postType}
              </span>
            ) : null}
            {priority ? <PriorityChip priority={priority} /> : null}
          </div>
          <p className={styles.title}>{title}</p>
          <div className={styles.meta}>
            <StatusChip status={status} size="sm" />
            <PillarChip name={pillar.name} color={pillar.color} size="sm" />
          </div>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronRight />
        </span>
      </button>
    );
  },
);
