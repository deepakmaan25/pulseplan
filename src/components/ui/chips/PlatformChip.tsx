import type { HTMLAttributes } from "react";
import { PlatformIcon } from "../PlatformIcon";
import styles from "./chips.module.css";

export type Platform = "ig" | "li" | "x" | "yt" | "th";

const LABELS: Record<Platform, string> = {
  ig: "Instagram",
  li: "LinkedIn",
  x: "X",
  yt: "YouTube",
  th: "Threads",
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
          color: mono ? "var(--ink-2)" : `var(--plat-${platform})`,
        }}
        aria-hidden="true"
      >
        <PlatformIcon platform={platform} size={size === "sm" ? 15 : 17} />
      </span>
      {showLabel ? <span>{LABELS[platform]}</span> : null}
    </span>
  );
}
