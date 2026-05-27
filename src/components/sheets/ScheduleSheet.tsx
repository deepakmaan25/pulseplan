"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ScheduleSheet.module.css";

const TODAY = "2026-05-16";
const WEEK_START = "2026-05-10";

const TIME_CHIPS = [
  "6:00 AM",
  "7:00 AM",
  "9:00 AM",
  "12:00 PM",
  "3:00 PM",
  "5:00 PM",
  "6:00 PM",
  "8:00 PM",
];

interface WeekCell {
  date: string;
  dayLetter: string;
  dayNum: number;
  isToday: boolean;
}

function getWeekCells(): WeekCell[] {
  const start = new Date(WEEK_START + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().split("T")[0]!;
    return {
      date: iso,
      dayLetter: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      dayNum: d.getDate(),
      isToday: iso === TODAY,
    };
  });
}

const WEEK_CELLS = getWeekCells();

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface ScheduleSheetProps {
  open: boolean;
  onClose: () => void;
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
        {/* Suggested slot */}
        <div className={styles.suggestedSlot}>
          <span className={styles.suggestedLabel}>Best slot</span>
          <button
            type="button"
            className={styles.suggestedBtn}
            onClick={() => {
              setDate(TODAY);
              setTime("9:00 AM");
            }}
          >
            Today · 9:00 AM
          </button>
        </div>

        {/* Day picker strip */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Date</p>
          <div className={styles.dayStrip}>
            {WEEK_CELLS.map((cell) => (
              <button
                key={cell.date}
                type="button"
                aria-pressed={date === cell.date}
                onClick={() => setDate(cell.date)}
                className={`${styles.dayCell} ${date === cell.date ? styles.dayCellSelected : ""} ${cell.isToday ? styles.dayCellToday : ""}`}
              >
                <span className={styles.dayLetter}>{cell.dayLetter}</span>
                <span className={styles.dayNum}>{cell.dayNum}</span>
              </button>
            ))}
          </div>
          <p className={styles.dateDisplay}>{formatDate(date)}</p>
        </div>

        {/* Time chips */}
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

        {/* Reminder row */}
        <div className={styles.reminderRow}>
          <span className={styles.reminderLabel}>Reminder</span>
          <span className={styles.reminderValue}>30 min before</span>
        </div>
      </div>
    </Sheet>
  );
}
