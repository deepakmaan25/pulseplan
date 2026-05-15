"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./IconButton.module.css";

export type IconButtonVariant = "ghost" | "filled" | "tonal" | "primary";
export type IconButtonSize = 36 | 40 | 44 | 48;

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  selected?: boolean;
  loading?: boolean;
  badge?: number | boolean;
  type?: "button" | "submit" | "reset";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      label,
      variant = "ghost",
      size = 40,
      selected = false,
      loading = false,
      disabled,
      badge,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const expandHit = size < 44;
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        aria-pressed={selected || undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        data-variant={variant}
        data-size={size}
        data-selected={selected ? "true" : undefined}
        className={`${styles.button} pp2-press ${expandHit ? "pp2-hit" : ""} ${className ?? ""}`}
        {...rest}
      >
        <span aria-hidden="true">{icon}</span>
        {badge !== undefined && badge !== false && badge !== 0 ? (
          <span
            className={styles.badge}
            data-dot={typeof badge === "boolean" ? "true" : undefined}
            aria-hidden="true"
          >
            {typeof badge === "number" ? (badge > 99 ? "99+" : badge) : null}
          </span>
        ) : null}
      </button>
    );
  },
);
