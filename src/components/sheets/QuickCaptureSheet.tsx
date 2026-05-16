"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import { PILLARS } from "@/mocks/fixtures";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import styles from "./QuickCaptureSheet.module.css";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "ig", label: "Instagram" },
  { value: "li", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "yt", label: "YouTube" },
  { value: "th", label: "Threads" },
];

interface QuickCaptureSheetProps {
  open: boolean;
  onClose: () => void;
}

export function QuickCaptureSheet({ open, onClose }: QuickCaptureSheetProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [pillarId, setPillarId] = useState<string | null>(null);

  function handleAdd() {
    // M2c: fire optimistic mutation here
    setTitle("");
    setPlatform(null);
    setPillarId(null);
    onClose();
  }

  function handleClose() {
    setTitle("");
    setPlatform(null);
    setPillarId(null);
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="Quick Capture"
      kicker="New Post"
      footer={
        <Button
          variant="filled"
          size="md"
          onClick={handleAdd}
          disabled={!title.trim()}
          style={{ width: "100%" }}
        >
          Add to Ideas
        </Button>
      }
    >
      <div className={styles.body}>
        <textarea
          className={styles.titleInput}
          placeholder="What's the post idea?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
          aria-label="Post idea"
        />

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Platform</p>
          <div className={styles.chips}>
            {PLATFORMS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={platform === value}
                onClick={() => setPlatform(platform === value ? null : value)}
                className={`${styles.chip} ${platform === value ? styles.chipSelected : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Pillar</p>
          <div className={styles.chips}>
            {PILLARS.map((pl) => (
              <button
                key={pl.id}
                type="button"
                aria-pressed={pillarId === pl.id}
                onClick={() => setPillarId(pillarId === pl.id ? null : pl.id)}
                className={styles.chip}
                style={
                  pillarId === pl.id
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
      </div>
    </Sheet>
  );
}
