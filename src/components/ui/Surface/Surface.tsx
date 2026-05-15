import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Surface.module.css";

export type SurfaceLevel = 1 | 2 | 3 | 4;

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  level?: SurfaceLevel;
  padded?: boolean;
  asChild?: false;
  children?: ReactNode;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  function Surface(
    { level = 1, padded = false, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-level={level}
        data-padded={padded || undefined}
        className={`${styles.surface} ${className ?? ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
