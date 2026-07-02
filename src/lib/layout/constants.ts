/**
 * Single source for the responsive-layout strategy. Imported by:
 *   - src/app/layout.tsx                              — no-flash boot script
 *   - src/components/providers/LayoutProvider.tsx     — the runtime provider
 *   - src/app/(app)/AppShellClient.tsx                — shell resolution
 *
 * Mirrors the breakpoint values declared in src/styles/tokens.css
 * (--bp-lg). Keep the 1024 boundary in sync across both files.
 *
 * Strategy:
 *   1. The structural mobile↔desktop switch happens at LG (1024px).
 *   2. `auto` mode = follow the viewport (the real product behavior).
 *   3. A preview OVERRIDE ('mobile' | 'desktop') can be set from the
 *      desktop top bar — a showcase affordance, not a user setting. It is
 *      persisted to a cookie so the choice survives navigation AND so the
 *      server can render the correct first paint (no flash).
 */

export const LAYOUT_BP_LG = 1024;
export const LAYOUT_MEDIA_QUERY = `(min-width: ${LAYOUT_BP_LG}px)`;

/** Cookie the server reads for first-paint; written by the provider. */
export const LAYOUT_COOKIE = "pp2-layout";
/** localStorage mirror so the preview choice is instant on the client. */
export const LAYOUT_STORAGE_KEY = "pp2-layout";

export const LAYOUT_MODES = ["mobile", "desktop"] as const;
export type LayoutMode = (typeof LAYOUT_MODES)[number];

/** 'auto' follows the viewport; the two explicit modes are preview overrides. */
export const LAYOUT_PREFS = ["auto", "mobile", "desktop"] as const;
export type LayoutPref = (typeof LAYOUT_PREFS)[number];

export function isLayoutPref(value: unknown): value is LayoutPref {
  return (
    typeof value === "string" &&
    (LAYOUT_PREFS as readonly string[]).includes(value)
  );
}

/** Resolve a pref + viewport signal into a concrete layout mode. */
export function resolveLayout(
  pref: LayoutPref,
  viewportIsWide: boolean,
): LayoutMode {
  if (pref === "mobile" || pref === "desktop") return pref;
  return viewportIsWide ? "desktop" : "mobile";
}
