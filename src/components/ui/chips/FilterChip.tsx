"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./chips.module.css";

export interface FilterChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  label: string;
  active?: boolean;
  leadingIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
}

export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip(
    { label, active = false, leadingIcon, className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={active}
        className={`${styles.chip} ${styles.filter} pp2-press ${className ?? ""}`}
        {...rest}
      >
        {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
        <span>{label}</span>
      </button>
    );
  },
);
