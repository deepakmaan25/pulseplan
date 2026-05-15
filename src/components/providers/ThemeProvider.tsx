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
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  isTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme/constants";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(value: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    // localStorage may be unavailable (privacy modes, sandboxed iframes).
    // In-memory state still works for the current session.
  }
}

function getSystemPrefersDark(): boolean {
  try {
    return window.matchMedia(THEME_MEDIA_QUERY).matches;
  } catch {
    return false;
  }
}

function applyDarkClass(isDark: boolean): void {
  try {
    document.documentElement.classList.toggle("dark", isDark);
  } catch {
    // Document may be unavailable mid-render in unusual hosts; the next
    // effect tick will recover.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start at 'auto' so SSR markup is deterministic. The inline boot script
  // in layout.tsx has already applied the correct `dark` class; this state
  // mirrors that on mount, then keeps it in sync as the user toggles.
  const [theme, setThemeState] = useState<Theme>("auto");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) setThemeState(stored);
    setSystemDark(getSystemPrefersDark());

    let mql: MediaQueryList | null = null;
    try {
      mql = window.matchMedia(THEME_MEDIA_QUERY);
    } catch {
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "auto" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    applyDarkClass(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    writeStoredTheme(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
