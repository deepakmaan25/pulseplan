/**
 * Single source for the responsive-layout strategy. Imported by:
 *   - src/components/providers/LayoutProvider.tsx     — the runtime provider
 *   - src/app/(app)/AppShellClient.tsx                — shell resolution
 *
 * Mirrors the breakpoint values declared in src/styles/tokens.css
 * (--bp-lg). Keep the 1024 boundary in sync across both files.
 *
 * Strategy: the structural mobile↔desktop switch happens at LG (1024px) and
 * follows the real viewport. There is no preview override or persisted
 * preference — the app is simply responsive.
 */

export const LAYOUT_BP_LG = 1024;
export const LAYOUT_MEDIA_QUERY = `(min-width: ${LAYOUT_BP_LG}px)`;

export const LAYOUT_MODES = ["mobile", "desktop"] as const;
export type LayoutMode = (typeof LAYOUT_MODES)[number];
