import type { HTMLAttributes, ReactNode } from "react";
import styles from "./AppBar.module.css";

export interface AppBarProps extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  kicker?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: "compact" | "prominent";
}

export function AppBar({
  title,
  subtitle,
  kicker,
  leading,
  trailing,
  variant = "prominent",
  className,
  ...rest
}: AppBarProps) {
  return (
    <header
      data-variant={variant}
      className={`${styles.appbar} ${className ?? ""}`}
      {...rest}
    >
      {leading ? <div className={styles.leading}>{leading}</div> : null}
      <div className={styles.titleBlock}>
        {kicker && variant === "prominent" ? (
          <span className={styles.kicker}>{kicker}</span>
        ) : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {trailing ? <div className={styles.trailing}>{trailing}</div> : null}
    </header>
  );
}
