import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  tone?: "neutral" | "brand";
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  tone = "neutral",
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={`${styles.empty} ${className ?? ""}`}>
      {icon ? (
        <div className={styles.icon} data-tone={tone} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {primaryAction || secondaryAction ? (
        <div className={styles.actions}>
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
