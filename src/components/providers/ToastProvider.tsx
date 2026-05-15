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
import { Snackbar } from "../ui/Snackbar/Snackbar";

/**
 * Toast / Snackbar provider. Behavior locked to HANDOFF.md §6:
 *   - position: 92px from bottom (above bottom nav)
 *   - lifetime: 2.4s
 *   - one at a time (a new toast replaces the current)
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
      {current ? (
        <Snackbar
          key={current.id}
          message={current.message}
          tone={current.tone ?? "default"}
          actionLabel={current.actionLabel}
          onAction={
            current.actionLabel
              ? () => {
                  current.onAction?.();
                  dismiss(current.id);
                }
              : undefined
          }
        />
      ) : null}
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
