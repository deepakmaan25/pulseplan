"use client";

import { AlertCircle, CalendarClock } from "lucide-react";
import { ToneIcon } from "@/components/ui/ToneIcon/ToneIcon";
import styles from "./OverdueCallout.module.css";

export interface OverdueCalloutProps {
  title: string;
  onTap: () => void;
}

export function OverdueCallout({ title, onTap }: OverdueCalloutProps) {
  return (
    <button
      type="button"
      className={`${styles.callout} pp2-press`}
      onClick={onTap}
      aria-label={`Overdue: ${title}. Tap to open.`}
    >
      <ToneIcon icon={<AlertCircle size={16} />} tone="error" size={32} />
      <span className={styles.body}>
        <span className={styles.kicker}>Overdue</span>
        <span className={styles.title}>{title}</span>
      </span>
      <span className={styles.action} aria-hidden="true">
        <CalendarClock size={13} />
        Reschedule
      </span>
    </button>
  );
}
