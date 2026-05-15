"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  danger?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "filled",
      size = "md",
      danger = false,
      loading = false,
      disabled,
      leadingIcon,
      trailingIcon,
      children,
      fullWidth,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-danger={danger ? "true" : undefined}
        data-full-width={fullWidth ? "true" : undefined}
        className={`${styles.button} pp2-press ${className ?? ""}`}
        {...rest}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : null}
        {!loading && leadingIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <span
          className={styles.label}
          data-loading={loading ? "true" : undefined}
        >
          {children}
        </span>
        {!loading && trailingIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </button>
    );
  },
);
