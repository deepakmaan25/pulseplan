"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ScheduleSheet.module.css";

const TODAY = "2026-05-16";

const TIME_CHIPS = [
  "8:00 AM",
  "9:00 AM",
  "12:00 PM",
  "3:00 PM",
  "6:00 PM",
  "8:00 PM",
];

interface ScheduleSheetProps {
  open: boolean;
  onClose: () => void;
  /** Called when the user confirms a date + time. */
  onSchedule: (date: string, time: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export function ScheduleSheet({
  open,
  onClose,
  onSchedule,
  initialDate,
  initialTime,
}: ScheduleSheetProps) {
  const [date, setDate] = useState(initialDate ?? TODAY);
  const [time, setTime] = useState(initialTime ?? "9:00 AM");

  function handleConfirm() {
    onSchedule(date, time);
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Schedule Post"
      kicker="Pick a date & time"
      footer={
        <div className={styles.footerRow}>
          <Button
            variant="outlined"
            size="md"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="md"
            onClick={handleConfirm}
            style={{ flex: 1 }}
          >
            Schedule
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Date</p>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            min={TODAY}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Scheduled date"
          />
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Time</p>
          <div className={styles.timeChips}>
            {TIME_CHIPS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={time === t}
                onClick={() => setTime(t)}
                className={`${styles.timeChip} ${time === t ? styles.timeChipSelected : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
