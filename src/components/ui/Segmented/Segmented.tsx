"use client";

import styles from "./Segmented.module.css";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`${styles.segmented} ${className ?? ""}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={option.disabled}
            data-size={size}
            className={styles.tab}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
