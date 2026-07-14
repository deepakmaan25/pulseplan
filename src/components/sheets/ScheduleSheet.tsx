"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ScheduleSheet.module.css";

const TODAY = "2026-05-16";
const WEEK_START = "2026-05-10";

// "8:00 PM" replaced by a dedicated "Custom" chip handled separately
const PRESET_TIMES = [
  "6:00 AM",
  "7:00 AM",
  "9:00 AM",
  "12:00 PM",
  "3:00 PM",
  "5:00 PM",
  "6:00 PM",
];

interface WeekCell {
  date: string;
  dayLetter: string;
  dayNum: number;
  isToday: boolean;
}

function getWeekCells(weekOffset: number): WeekCell[] {
  const start = new Date(WEEK_START + "T00:00:00");
  start.setDate(start.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      date: iso,
      dayLetter: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      dayNum: d.getDate(),
      isToday: iso === TODAY,
    };
  });
}

/** Label for the visible week, e.g. "May 10 – 16" (or across months). */
function weekLabel(cells: WeekCell[]): string {
  const firstCell = cells[0];
  const lastCell = cells[cells.length - 1];
  if (!firstCell || !lastCell) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const first = new Date(firstCell.date + "T00:00:00");
  const last = new Date(lastCell.date + "T00:00:00");
  const sameMonth = first.getMonth() === last.getMonth();
  return `${first.toLocaleDateString("en-US", opts)} – ${last.toLocaleDateString(
    "en-US",
    sameMonth ? { day: "numeric" } : opts,
  )}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Convert 24-hour string ("09:30") → 12-hour display ("9:30 AM") */
function formatTime(h24: string): string {
  const parts = h24.split(":");
  const h = parseInt(parts[0] ?? "9", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
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
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customHour, setCustomHour] = useState("09:00");
  const [weekOffset, setWeekOffset] = useState(0);

  const weekCells = useMemo(() => getWeekCells(weekOffset), [weekOffset]);

  function handleConfirm() {
    onSchedule(date, time);
    onClose();
  }

  function handlePresetTime(t: string) {
    setIsCustomMode(false);
    setTime(t);
  }

  function handleCustomChange(h24: string) {
    setCustomHour(h24);
    setTime(formatTime(h24));
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
              setIsCustomMode(false);
              setDate(TODAY);
              setTime("9:00 AM");
            }}
          >
            Today · 9:00 AM
          </button>
        </div>

        {/* Day picker strip */}
        <div className={styles.section}>
          <div className={styles.dateHead}>
            <p className={styles.sectionLabel}>Date</p>
            <div className={styles.weekNav}>
              <button
                type="button"
                className={styles.weekNavBtn}
                onClick={() => setWeekOffset((w) => w - 1)}
                aria-label="Previous week"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.weekLabel}>{weekLabel(weekCells)}</span>
              <button
                type="button"
                className={styles.weekNavBtn}
                onClick={() => setWeekOffset((w) => w + 1)}
                aria-label="Next week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className={styles.dayStrip}>
            {weekCells.map((cell) => (
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
            {PRESET_TIMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={!isCustomMode && time === t}
                onClick={() => handlePresetTime(t)}
                className={`${styles.timeChip} ${!isCustomMode && time === t ? styles.timeChipSelected : ""}`}
              >
                {t}
              </button>
            ))}
            {/* Custom chip — shows a time input when active */}
            <button
              type="button"
              aria-pressed={isCustomMode}
              onClick={() => {
                setIsCustomMode(true);
                setTime(formatTime(customHour));
              }}
              className={`${styles.timeChip} ${isCustomMode ? styles.timeChipSelected : ""}`}
            >
              Custom
            </button>
          </div>
          {isCustomMode && (
            <input
              type="time"
              className={styles.customTimeInput}
              value={customHour}
              onChange={(e) => handleCustomChange(e.target.value)}
              aria-label="Custom time"
            />
          )}
        </div>

        {/* Repeat + Reminder card */}
        <div className={styles.optionsCard}>
          <div className={styles.optionRow}>
            <span className={styles.optionLabel}>Repeat</span>
            <span className={styles.optionValue}>Never</span>
          </div>
          <div className={`${styles.optionRow} ${styles.optionRowBorder}`}>
            <span className={styles.optionLabel}>Reminder</span>
            <span className={styles.optionValue}>30 min before</span>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
