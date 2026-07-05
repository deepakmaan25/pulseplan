"use client";

import { useLayoutMode } from "@/components/providers";
import { BoardMobile } from "./BoardMobile";
import { BoardDesktop } from "./BoardDesktop";

/**
 * Layout resolver. Desktop shows a real multi-column kanban; mobile keeps the
 * single-column stage switcher (Board also lives under the Plan|Board toggle on
 * mobile). Both read the same posts store.
 */
export function BoardScreen() {
  const mode = useLayoutMode();
  return mode === "desktop" ? <BoardDesktop /> : <BoardMobile />;
}
