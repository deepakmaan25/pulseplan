"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Toast shell. The visual primitive (Snackbar) lands in M1a per the
 * component inventory in HANDOFF.md §6. This shell exposes the API
 * (`toast`, `dismiss`) and a minimal token-styled viewport so feature code
 * can already wire up UNDO flows in M1b without waiting on the polished
 * primitive.
 *
 * Behavior matches HANDOFF.md:
 *   - position: 92px from bottom (above bottom nav)
 *   - lifetime: 2.4s
 *   - one toast at a time (a new toast replaces the current one)
 */

export type ToastTone = "default" | "primary" | "success" | "error" | "review";

export type ToastInput = {
  message: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
};

type Toast = Required<Pick<ToastInput, "message">> &
  ToastInput & {
    id: string;
  };

type ToastContextValue = {
  toast: (input: ToastInput | string) => string;
  dismiss: (id?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const DEFAULT_LIFETIME_MS = 2400;

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Toast | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(
    (id?: string) => {
      setCurrent((c) => {
        if (id && c && c.id !== id) return c;
        clearTimer();
        return null;
      });
    },
    [clearTimer],
  );

  const toast = useCallback(
    (input: ToastInput | string) => {
      const normalized: ToastInput =
        typeof input === "string" ? { message: input } : input;
      const next: Toast = {
        id: makeId(),
        tone: "default",
        ...normalized,
      };
      clearTimer();
      setCurrent(next);
      const lifetime = next.durationMs ?? DEFAULT_LIFETIME_MS;
      timerRef.current = window.setTimeout(() => {
        setCurrent((c) => (c && c.id === next.id ? null : c));
        timerRef.current = null;
      }, lifetime);
      return next.id;
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss }),
    [toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toast={current} onDismiss={() => dismiss()} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

function ToastViewport({
  toast,
  onDismiss,
}: {
  toast: Toast | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  const accent =
    toast.tone === "primary"
      ? "var(--primary)"
      : toast.tone === "success"
        ? "var(--success)"
        : toast.tone === "error"
          ? "var(--error)"
          : toast.tone === "review"
            ? "var(--st-review-fg)"
            : "var(--ink-3)";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "92px",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "var(--s-6)",
        maxWidth: "min(92vw, 420px)",
        padding: "var(--s-5) var(--s-7)",
        background: "var(--surface-4)",
        color: "var(--ink-1)",
        border: "1px solid var(--divider)",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--e-3)",
        font: "var(--t-body-sm)",
        letterSpacing: "var(--ls-body)",
        zIndex: 60,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "var(--r-full)",
          background: accent,
          flex: "0 0 auto",
        }}
      />
      <span style={{ flex: 1 }}>{toast.message}</span>
      {toast.actionLabel ? (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            onDismiss();
          }}
          style={{
            appearance: "none",
            background: "transparent",
            border: 0,
            padding: "var(--s-2) var(--s-4)",
            margin: "calc(var(--s-2) * -1) calc(var(--s-2) * -1)",
            color: "var(--primary)",
            font: "var(--t-button)",
            cursor: "pointer",
            borderRadius: "var(--r-sm)",
          }}
        >
          {toast.actionLabel}
        </button>
      ) : null}
    </div>
  );
}
