import type { HTMLAttributes } from "react";
import styles from "./chips.module.css";

export interface PillarChipProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  color: string;
  size?: "sm" | "md";
  withDot?: boolean;
}

export function PillarChip({
  name,
  color,
  size = "md",
  withDot = true,
  className,
  ...rest
}: PillarChipProps) {
  return (
    <span
      data-size={size}
      className={`${styles.chip} ${styles.pillar} ${className ?? ""}`}
      {...rest}
    >
      {withDot ? (
        <span
          className={styles.square}
          style={{ background: color }}
          aria-hidden="true"
        />
      ) : null}
      <span>{name}</span>
    </span>
  );
}
