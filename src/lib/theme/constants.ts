/**
 * Single source for the theme selector strategy. Imported by:
 *   - src/app/layout.tsx           — the no-flash inline boot script
 *   - src/components/providers/ThemeProvider.tsx
 *
 * Strategy (DO NOT split across <body> or inner wrappers):
 *   1. `<html>` always carries `class="pp2"` (set statically in layout.tsx).
 *   2. The `dark` class is toggled on `<html>` only — never on `<body>` or
 *      any inner element. Tokens (`.pp2` / `.pp2.dark`) and the Tailwind
 *      `dark` custom variant both scope off these two classes.
 *   3. The boot script and ThemeProvider read from the same localStorage key
 *      and the same media query. State and DOM stay in sync.
 */

export const THEME_STORAGE_KEY = "pp2-theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const THEME_VALUES = ["light", "dark", "auto"] as const;

export type Theme = (typeof THEME_VALUES)[number];
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" &&
    (THEME_VALUES as readonly string[]).includes(value)
  );
}
