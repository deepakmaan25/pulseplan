"use client";

import { useLayoutMode } from "@/components/providers";
import { TodayMobile } from "./TodayMobile";
import { TodayDesktop } from "./TodayDesktop";

/**
 * Layout resolver. All Today data logic lives in useTodayData(); these two
 * components render the same data in different arrangements. The shell already
 * decided mobile vs desktop, but we resolve here too so the screen is correct
 * even if rendered outside the app shell (e.g. the mobile preview frame).
 */
export function TodayClient() {
  const mode = useLayoutMode();
  return mode === "desktop" ? <TodayDesktop /> : <TodayMobile />;
}
