import type { HTMLAttributes } from "react";
import styles from "./chips.module.css";

export type Priority = "P0" | "P1" | "P2";

const LABELS: Record<Priority, string> = {
  P0: "Critical",
  P1: "High",
  P2: "Normal",
};

export interface PriorityChipProps extends HTMLAttributes<HTMLSpanElement> {
  priority: Priority;
}

export function PriorityChip({
  priority,
  className,
  ...rest
}: PriorityChipProps) {
  return (
    <span
      data-level={priority}
      className={`${styles.chip} ${styles.priority} ${className ?? ""}`}
      aria-label={`${priority} priority — ${LABELS[priority]}`}
      {...rest}
    >
      {priority}
    </span>
  );
}
