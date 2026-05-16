"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IconButton } from "../IconButton/IconButton";
import { X } from "lucide-react";
import styles from "./Sheet.module.css";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  /** Defaults to true. Set false for non-dismissable confirm flows. */
  dismissable?: boolean;
}

export function Sheet({
  open,
  onClose,
  title,
  kicker,
  children,
  footer,
  closeLabel = "Close",
  dismissable = true,
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  // Stable ref so onClose changes never trigger effect re-runs (which would
  // restore focus mid-session and dismiss the mobile keyboard on each keystroke).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    previouslyFocused.current =
      (document.activeElement as HTMLElement | null) ?? null;
    const raf = requestAnimationFrame(() => setVisible(true));

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissable) {
        event.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the sheet only if nothing inside already has focus
    // (e.g. an autoFocus textarea). Includes textarea so capture sheets land
    // on the text field rather than the close button.
    const focusTimer = window.setTimeout(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      if (sheet.contains(document.activeElement)) return;
      const focusable = sheet.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? sheet).focus();
    }, 50);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      window.clearTimeout(focusTimer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, dismissable]);

  const onScrim = useCallback(() => {
    if (dismissable) onClose();
  }, [dismissable, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div
        className={styles.scrim}
        data-open={visible ? "true" : undefined}
        aria-hidden="true"
        onClick={onScrim}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.sheet}
        data-open={visible ? "true" : undefined}
        tabIndex={-1}
      >
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <div className={styles.headerText}>
            {kicker ? <span className={styles.kicker}>{kicker}</span> : null}
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          </div>
          {dismissable ? (
            <IconButton
              icon={<X />}
              label={closeLabel}
              variant="ghost"
              size={40}
              onClick={onClose}
            />
          ) : null}
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </>,
    document.body,
  );
}
