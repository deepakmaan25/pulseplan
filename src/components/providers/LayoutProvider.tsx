
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LAYOUT_COOKIE,
  LAYOUT_MEDIA_QUERY,
  LAYOUT_STORAGE_KEY,
  isLayoutPref,
  resolveLayout,
  type LayoutMode,
  type LayoutPref,
} from "@/lib/layout/constants";

type LayoutContextValue = {
  /** The user/preview preference: 'auto' (follow viewport) | 'mobile' | 'desktop'. */
  pref: LayoutPref;
  /** The resolved concrete layout actually rendered. */
  mode: LayoutMode;
  /** Whether the viewport itself is wide (≥ lg), independent of pref. */
  viewportIsWide: boolean;
  /** Set the preview preference (persists to cookie + localStorage). */
  setPref: (next: LayoutPref) => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

function readStoredPref(): LayoutPref | null {
  try {
    const v = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    return isLayoutPref(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStoredPref(value: LayoutPref): void {
  // localStorage for instant client reads…
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, value);
  } catch {
    // privacy modes / sandboxed iframes — session state still works.
  }
  // …and a cookie so the SERVER can render the right first paint (no flash).
  try {
    // 1-year, lax, root path. Not sensitive — purely presentational.
    document.cookie = `${LAYOUT_COOKIE}=${value};path=/;max-age=31536000;samesite=lax`;
  } catch {
    // ignore
  }
}

function getViewportIsWide(): boolean {
  try {
    return window.matchMedia(LAYOUT_MEDIA_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * @param initialPref  Pref the SERVER read from the cookie, so the very first
 *                     client render matches SSR markup (avoids hydration flash).
 */
export function LayoutProvider({
  children,
  initialPref = "auto",
}: {
  children: ReactNode;
  initialPref?: LayoutPref;
}) {
  const [pref, setPrefState] = useState<LayoutPref>(initialPref);
  // SSR can't know the viewport. We seed `wide` from the cookie hint: if the
  // server already resolved 'desktop', assume wide for first paint, then the
  // mount effect corrects it from the real matchMedia.
  const [viewportIsWide, setViewportIsWide] = useState<boolean>(
    initialPref === "desktop",
  );

  useEffect(() => {
    // Pick up any client-stored pref that's newer than the cookie hint.
    const stored = readStoredPref();
    if (stored) setPrefState(stored);
    setViewportIsWide(getViewportIsWide());

    let mql: MediaQueryList | null = null;
    try {
      mql = window.matchMedia(LAYOUT_MEDIA_QUERY);
    } catch {
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      setViewportIsWide(event.matches);
    };
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  const mode = resolveLayout(pref, viewportIsWide);

  const setPref = useCallback((next: LayoutPref) => {
    setPrefState(next);
    writeStoredPref(next);
  }, []);

  const value = useMemo<LayoutContextValue>(
    () => ({ pref, mode, viewportIsWide, setPref }),
    [pref, mode, viewportIsWide, setPref],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayout must be used inside <LayoutProvider>");
  }
  return ctx;
}

/** Convenience: just the resolved mode. */
export function useLayoutMode(): LayoutMode {
  return useLayout().mode;
}
