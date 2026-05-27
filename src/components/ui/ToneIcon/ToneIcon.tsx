import type { ReactNode } from "react";
import styles from "./ToneIcon.module.css";

export type ToneIconTone =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export interface ToneIconProps {
  icon: ReactNode;
  tone?: ToneIconTone;
  size?: number;
}

export function ToneIcon({ icon, tone = "neutral", size = 36 }: ToneIconProps) {
  return (
    <span
      className={`${styles.wrap} ${styles[`tone_${tone}`]}`}
      style={{ width: size, height: size, minWidth: size }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}
