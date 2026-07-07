"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LAYOUT_MEDIA_QUERY, type LayoutMode } from "@/lib/layout/constants";

type LayoutContextValue = {
  /** The resolved concrete layout actually rendered. */
  mode: LayoutMode;
  /** Whether the viewport itself is wide (≥ lg). Same as `mode === 'desktop'`. */
  viewportIsWide: boolean;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

function getViewportIsWide(): boolean {
  try {
    return window.matchMedia(LAYOUT_MEDIA_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * Layout is now purely a function of the real viewport width — the app is
 * genuinely responsive, with no preview override or persisted preference.
 * (The old desktop-only "preview the mobile layout in a phone frame" toggle
 * was removed: it only existed as a showcase affordance and caused real
 * confusion, since a framed preview reads differently from an actual device.)
 *
 * @param initialWide  Optional SSR hint for first paint. Defaults to false
 *                     (mobile-first); the mount effect corrects from matchMedia.
 */
export function LayoutProvider({
  children,
  initialWide = false,
}: {
  children: ReactNode;
  initialWide?: boolean;
}) {
  const [viewportIsWide, setViewportIsWide] = useState<boolean>(initialWide);

  useEffect(() => {
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

  const mode: LayoutMode = viewportIsWide ? "desktop" : "mobile";

  const value = useMemo<LayoutContextValue>(
    () => ({ mode, viewportIsWide }),
    [mode, viewportIsWide],
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
