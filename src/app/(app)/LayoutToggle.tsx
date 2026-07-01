"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Segmented } from "@/components/ui";
import { useLayout } from "@/components/providers";
import styles from "./LayoutToggle.module.css";

type PreviewChoice = "desktop" | "mobile";

/**
 * Desktop-only preview affordance. The app is genuinely auto-responsive;
 * this lets someone on a wide screen preview the mobile layout in a phone
 * frame without resizing. Labeled "Preview" so it never reads as the app's
 * real responsive behavior. Hidden entirely on real mobile viewports.
 */
export function LayoutToggle() {
  const { pref, viewportIsWide, setPref } = useLayout();

  // Nothing to preview on a real phone — you're already there.
  if (!viewportIsWide) return null;

  // Map the tri-state pref onto the two preview buttons. 'auto' on a wide
  // viewport resolves to desktop, so show 'desktop' selected.
  const choice: PreviewChoice = pref === "mobile" ? "mobile" : "desktop";

  return (
    <div className={styles.wrap}>
      <span className={styles.kicker}>Preview</span>
      <Segmented<PreviewChoice>
        ariaLabel="Preview layout"
        size="sm"
        value={choice}
        onChange={(next) => setPref(next)}
        options={[
          { value: "desktop", label: "Desktop" },
          { value: "mobile", label: "Mobile" },
        ]}
      />
    </div>
  );
}

/** Small inline icon labels for the toggle, exported for reuse if needed. */
export const PreviewIcons = { Monitor, Smartphone };
