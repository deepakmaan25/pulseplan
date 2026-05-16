"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import { PILLARS } from "@/mocks/fixtures";
import { usePosts } from "@/store/PostsContext";
import { useToast } from "@/components/providers/ToastProvider";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import type { Priority } from "@/components/ui/chips/PriorityChip";
import styles from "./QuickCaptureSheet.module.css";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "ig", label: "Instagram" },
  { value: "li", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "yt", label: "YouTube" },
  { value: "th", label: "Threads" },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "P0", label: "Critical", color: "var(--pri-P0)" },
  { value: "P1", label: "High", color: "var(--pri-P1)" },
  { value: "P2", label: "Normal", color: "var(--pri-P2)" },
];

interface QuickCaptureSheetProps {
  open: boolean;
  onClose: () => void;
}

function resetState() {
  return {
    title: "",
    description: "",
    platform: null as Platform | null,
    pillarId: null as string | null,
    priority: null as Priority | null,
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

  function save(plan: boolean) {
    const pillar = PILLARS.find((p) => p.id === state.pillarId) ??
      PILLARS[0] ?? { id: "personal", name: "Personal", color: "#d97706" };
    const platform = state.platform ?? "ig";

    const description = state.description.trim() || undefined;
    addPost({
      title: state.title.trim(),
      description,
      status: plan ? "sched" : "idea",
      platform,
      pillar,
      priority: state.priority ?? undefined,
      scheduledDate: plan ? "2026-05-16" : undefined,
    });

    toast({
      message: plan ? "Planned for today ✓" : "Saved to ideas ✓",
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
        <div className={styles.footerRow}>
          <Button
            variant="outlined"
            size="md"
            onClick={() => save(false)}
            disabled={!canSave}
            style={{ flex: 1 }}
          >
            Save as Idea
          </Button>
          <Button
            variant="filled"
            size="md"
            onClick={() => save(true)}
            disabled={!canSave}
            style={{ flex: 1 }}
          >
            Plan for Today
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        {/* Title */}
        <textarea
          className={styles.titleInput}
          placeholder="What's the post idea?"
          value={state.title}
          onChange={(e) => set("title", e.target.value)}
          rows={2}
          aria-label="Post idea"
        />

        {/* Description */}
        <textarea
          className={`${styles.titleInput} ${styles.descInput}`}
          placeholder="Add a brief description or hook… (optional)"
          value={state.description}
          onChange={(e) => set("description", e.target.value)}
          rows={2}
          aria-label="Description"
        />

        {/* Platform */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Platform</p>
          <div className={styles.chips}>
            {PLATFORMS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={state.platform === value}
                onClick={() =>
                  set("platform", state.platform === value ? null : value)
                }
                className={`${styles.chip} ${state.platform === value ? styles.chipSelected : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Pillar</p>
          <div className={styles.chips}>
            {PILLARS.map((pl) => (
              <button
                key={pl.id}
                type="button"
                aria-pressed={state.pillarId === pl.id}
                onClick={() =>
                  set("pillarId", state.pillarId === pl.id ? null : pl.id)
                }
                className={styles.chip}
                style={
                  state.pillarId === pl.id
                    ? {
                        background: pl.color,
                        color: "#fff",
                        borderColor: "transparent",
                      }
                    : { borderColor: pl.color, color: pl.color }
                }
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Priority</p>
          <div className={styles.chips}>
            {PRIORITIES.map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                aria-pressed={state.priority === value}
                onClick={() =>
                  set("priority", state.priority === value ? null : value)
                }
                className={styles.chip}
                style={
                  state.priority === value
                    ? {
                        background: color,
                        color: "#fff",
                        borderColor: "transparent",
                      }
                    : { borderColor: color, color }
                }
              >
                {value} · {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
