"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import { Segmented } from "@/components/ui/Segmented/Segmented";
import { PILLARS } from "@/mocks/fixtures";
import { usePosts } from "@/store/PostsContext";
import { useToast } from "@/components/providers/ToastProvider";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import type { Priority } from "@/components/ui/chips/PriorityChip";
import styles from "./QuickCaptureSheet.module.css";

type CaptureMode = "idea" | "draft" | "schedule";

const MODE_OPTIONS: { value: CaptureMode; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "draft", label: "Draft" },
  { value: "schedule", label: "Schedule" },
];

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "ig", label: "IG" },
  { value: "li", label: "LI" },
  { value: "x", label: "X" },
  { value: "yt", label: "YT" },
  { value: "th", label: "TH" },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "P0", label: "P0" },
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
];

interface QuickCaptureSheetProps {
  open: boolean;
  onClose: () => void;
}

function resetState() {
  return {
    title: "",
    platform: null as Platform | null,
    pillarId: null as string | null,
    priority: null as Priority | null,
    mode: "idea" as CaptureMode,
  };
}

export function QuickCaptureSheet({ open, onClose }: QuickCaptureSheetProps) {
  const { addPost } = usePosts();
  const { toast } = useToast();
  const [state, setState] = useState(resetState);

  function set<K extends keyof ReturnType<typeof resetState>>(
    key: K,
    value: ReturnType<typeof resetState>[K],
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setState(resetState());
    onClose();
  }

  function save() {
    const pillar = PILLARS.find((p) => p.id === state.pillarId) ??
      PILLARS[0] ?? { id: "personal", name: "Personal", color: "#d97706" };
    const platform = state.platform ?? "ig";
    const plan = state.mode === "schedule";
    const status =
      state.mode === "idea"
        ? "idea"
        : state.mode === "draft"
          ? "draft"
          : "sched";

    addPost({
      title: state.title.trim(),
      status,
      platform,
      pillar,
      priority: state.priority ?? undefined,
      scheduledDate: plan ? "2026-05-16" : undefined,
    });

    toast({
      message:
        state.mode === "idea"
          ? "Saved to ideas ✓"
          : state.mode === "draft"
            ? "Saved to drafts ✓"
            : "Planned for today ✓",
      tone: "success",
      actionLabel: "UNDO",
      onAction: () => {},
    });

    setState(resetState());
    onClose();
  }

  const canSave = state.title.trim().length > 0;

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="Quick Capture"
      kicker="New Post"
      footer={
        <Button
          variant="filled"
          size="lg"
          fullWidth
          onClick={save}
          disabled={!canSave}
        >
          {state.mode === "idea"
            ? "Save as Idea"
            : state.mode === "draft"
              ? "Save as Draft"
              : "Plan for Today"}
        </Button>
      }
    >
      <div className={styles.body}>
        {/* Mode segmented */}
        <Segmented
          options={MODE_OPTIONS}
          value={state.mode}
          onChange={(v) => set("mode", v)}
          ariaLabel="Post mode"
          size="sm"
          className={styles.modeSegmented}
        />

        {/* Title */}
        <textarea
          className={styles.titleInput}
          placeholder="What's the post idea?"
          value={state.title}
          onChange={(e) => set("title", e.target.value)}
          rows={2}
          aria-label="Post idea"
          autoFocus
        />

        {/* Properties card */}
        <div className={styles.propsCard}>
          {/* Platform row */}
          <div className={styles.propRow}>
            <span className={styles.propLabel}>Platform</span>
            <div className={styles.propChips}>
              {PLATFORMS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={state.platform === value}
                  onClick={() =>
                    set("platform", state.platform === value ? null : value)
                  }
                  className={`${styles.propChip} ${state.platform === value ? styles.propChipSelected : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar row */}
          <div className={`${styles.propRow} ${styles.propRowBorder}`}>
            <span className={styles.propLabel}>Pillar</span>
            <div className={styles.propChips}>
              {PILLARS.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  aria-pressed={state.pillarId === pl.id}
                  onClick={() =>
                    set("pillarId", state.pillarId === pl.id ? null : pl.id)
                  }
                  className={styles.propChip}
                  style={
                    state.pillarId === pl.id
                      ? {
                          borderColor: pl.color,
                          color: pl.color,
                          background: `${pl.color}18`,
                        }
                      : { borderColor: pl.color, color: pl.color }
                  }
                >
                  <span
                    className={styles.pillarDot}
                    style={{ background: pl.color }}
                  />
                  {pl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Priority row */}
          <div className={`${styles.propRow} ${styles.propRowBorder}`}>
            <span className={styles.propLabel}>Priority</span>
            <div className={styles.propChips}>
              {PRIORITIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={state.priority === value}
                  onClick={() =>
                    set("priority", state.priority === value ? null : value)
                  }
                  className={`${styles.propChip} ${state.priority === value ? styles.propChipSelected : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
