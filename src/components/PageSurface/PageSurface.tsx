"use client";

import type { ReactNode } from "react";
import styles from "./PageSurface.module.css";

interface PageSurfaceProps {
  /** Eyebrow / kicker above the title (e.g. "WK 20 · MAY 11 — MAY 17"). */
  eyebrow?: ReactNode;
  /** Page title (e.g. "Analytics"). */
  title: ReactNode;
  /** Optional subtitle under the title. */
  subtitle?: ReactNode;
  /** Trailing header content, right-aligned (toggles, icon buttons). */
  actions?: ReactNode;
  /** When true, the body gets no default gutter/padding (screen controls it). */
  flushBody?: boolean;
  /** When true, uses a wider panel (e.g. Board's 5-column kanban). */
  wide?: boolean;
  /** When true, tints the panel surface so white content cards pop (e.g. Plan). */
  tinted?: boolean;
  children: ReactNode;
}

/**
 * The shared page surface: one lifted panel that encloses an entire screen's
 * content, sitting on the grey canvas. Header renders inside the panel with a
 * divider beneath it. Screens fill the body with either stacked <Section>
 * blocks or their own layout (e.g. Today's two-column grid).
 */
export function PageSurface({
  eyebrow,
  title,
  subtitle,
  actions,
  flushBody = false,
  wide = false,
  tinted = false,
  children,
}: PageSurfaceProps) {
  return (
    <div className={styles.screen}>
      <div
        className={`${styles.panel} ${wide ? styles.panelWide : ""} ${tinted ? styles.panelTinted : ""}`}
      >
        <header className={styles.pageHead}>
          <div className={styles.pageHeadText}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={styles.pageTitle}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.pageHeadActions}>{actions}</div>}
        </header>
        {flushBody ? children : <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
}

/** A horizontal-hairline-separated section inside a PageSurface (stacked screens). */
export function Section({
  label,
  ariaLabel,
  children,
}: {
  label?: ReactNode;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section} aria-label={ariaLabel}>
      {label && <p className={styles.sectionLabel}>{label}</p>}
      {children}
    </section>
  );
}
