"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { PillarChip } from "../ui/chips/PillarChip";
import { PlatformChip, type Platform } from "../ui/chips/PlatformChip";
import { PriorityChip, type Priority } from "../ui/chips/PriorityChip";
import styles from "./BoardCard.module.css";

export interface BoardCardProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  title: string;
  pillar: { name: string; color: string };
  platform: Platform;
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
      postType,
      priority,
      dayStamp,
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
        className={`${styles.card} pp2-press ${className ?? ""}`}
        {...rest}
      >
        <div className={styles.topRow}>
          <PillarChip name={pillar.name} color={pillar.color} size="sm" />
          {priority ? <PriorityChip priority={priority} /> : null}
        </div>
        <p className={styles.title}>{title}</p>
        <div className={styles.bottomRow}>
          <span className={styles.left}>
            <PlatformChip platform={platform} size="sm" showLabel={false} />
            {postType ? (
              <span style={{ textTransform: "uppercase" }}>{postType}</span>
            ) : null}
          </span>
          {dayStamp ? <span>{dayStamp}</span> : null}
        </div>
      </button>
    );
  },
);
