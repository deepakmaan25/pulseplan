import type { HTMLAttributes } from "react";
import styles from "./chips.module.css";

export type Platform = "ig" | "li" | "x" | "yt" | "th";

const LABELS: Record<Platform, string> = {
  ig: "Instagram",
  li: "LinkedIn",
  x: "X",
  yt: "YouTube",
  th: "Threads",
};

const GLYPH: Record<Platform, string> = {
  ig: "ig",
  li: "in",
  x: "x",
  yt: "yt",
  th: "th",
};

export interface PlatformChipProps extends HTMLAttributes<HTMLSpanElement> {
  platform: Platform;
  size?: "sm" | "md";
  showLabel?: boolean;
  mono?: boolean;
}

export function PlatformChip({
  platform,
  size = "md",
  showLabel = true,
  mono = false,
  className,
  ...rest
}: PlatformChipProps) {
  return (
    <span
      data-size={size}
      data-mono={mono ? "true" : undefined}
      className={`${styles.chip} ${styles.platform} ${className ?? ""}`}
      {...rest}
    >
      <span
        className={styles.platformGlyph}
        style={{
          background: mono ? "var(--ink-1)" : `var(--plat-${platform})`,
        }}
        aria-hidden="true"
      >
        {GLYPH[platform]}
      </span>
      {showLabel ? <span>{LABELS[platform]}</span> : null}
    </span>
  );
}
