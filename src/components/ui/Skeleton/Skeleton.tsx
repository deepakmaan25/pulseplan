import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonShape = "line" | "rect" | "circle";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  shape?: SkeletonShape;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  width,
  height,
  shape = "line",
  className,
  style,
}: SkeletonProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      data-shape={shape}
      className={`${styles.skel} ${className ?? ""}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height:
          typeof height === "number"
            ? `${height}px`
            : (height ?? (shape === "line" ? "1em" : undefined)),
        ...style,
      }}
    />
  );
}
