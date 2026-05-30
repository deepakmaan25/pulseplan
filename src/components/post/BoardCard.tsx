"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { PillarChip } from "../ui/chips/PillarChip";
import { PlatformChip, type Platform } from "../ui/chips/PlatformChip";
import { PriorityChip, type Priority } from "../ui/chips/PriorityChip";
import type { PostStatus } from "../ui/chips/StatusChip";
import styles from "./BoardCard.module.css";

export interface BoardCardProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  title: string;
  pillar: { name: string; color: string };
  platform: Platform;
  status: PostStatus;
  postType?: string;
  priority?: Priority;
  dayStamp?: string;
  type?: "button" | "submit" | "reset";
}

export const BoardCard = forwardRef<HTMLButtonElement, BoardCardProps>(
  function BoardCard(
    {
      title,
      pillar,
      platform,
      status,
      postType,
      priority,
      dayStamp,
      className,
      style,
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
        className={`${styles.card} pp2-press ${className ?? ""}`}
        style={
          { "--pp2-pillar": pillar.color, ...style } as React.CSSProperties
        }
        {...rest}
      >
        <div className={styles.topRow}>
          <PlatformChip platform={platform} size="sm" showLabel={false} />
          {postType ? (
            <span className={styles.typeLabel}>{postType}</span>
          ) : null}
          {priority ? <PriorityChip priority={priority} /> : null}
        </div>
        <p className={styles.title}>{title}</p>
        <div className={styles.bottomRow}>
          <span className={styles.left}>
            <PillarChip name={pillar.name} color={pillar.color} size="sm" />
          </span>
          <span className={styles.right}>
            {dayStamp ? (
              <span className={styles.dayStamp}>{dayStamp}</span>
            ) : null}
          </span>
        </div>
      </button>
    );
  },
);
