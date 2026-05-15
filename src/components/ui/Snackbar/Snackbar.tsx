"use client";

import styles from "./Snackbar.module.css";

export type SnackbarTone =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "review";

export interface SnackbarProps {
  message: string;
  tone?: SnackbarTone;
  actionLabel?: string;
  onAction?: () => void;
}

export function Snackbar({
  message,
  tone = "default",
  actionLabel,
  onAction,
}: SnackbarProps) {
  return (
    <div role="status" aria-live="polite" className={styles.snackbar}>
      <span className={styles.tone} data-tone={tone} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
      {actionLabel && onAction ? (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
