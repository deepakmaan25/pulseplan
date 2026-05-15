import type { HTMLAttributes } from "react";
import styles from "./chips.module.css";

export type PostStatus =
  | "idea"
  | "draft"
  | "review"
  | "sched"
  | "pub"
  | "overdue";

const LABELS: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Drafting",
  review: "Review",
  sched: "Scheduled",
  pub: "Published",
  overdue: "Overdue",
};

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  status: PostStatus;
  size?: "sm" | "md";
  count?: number;
  label?: string;
}

export function StatusChip({
  status,
  size = "md",
  count,
  label,
  className,
  ...rest
}: StatusChipProps) {
  return (
    <span
      data-state={status}
      data-size={size}
      className={`${styles.chip} ${styles.status} ${className ?? ""}`}
      {...rest}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span>{label ?? LABELS[status]}</span>
      {typeof count === "number" ? (
        <span aria-hidden="true" style={{ opacity: 0.7 }}>
          · {count}
        </span>
      ) : null}
    </span>
  );
}
