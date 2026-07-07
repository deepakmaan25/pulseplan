"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  SquareKanban,
  BarChart2,
  Plus,
} from "lucide-react";
import { BottomNav, type BottomNavTab } from "@/components/ui";
import { QuickCaptureSheet } from "@/components/sheets/QuickCaptureSheet";
import { useLayout } from "@/components/providers";
import { DesktopSidebar } from "./DesktopSidebar";
import styles from "./layout.module.css";

/* Mobile bottom-nav tabs. NOTE: Board has no slot here — it lives under the
 * Plan tab via an in-screen Plan|Board toggle (product decision). The desktop
 * sidebar lists Board separately. */
const TABS: [BottomNavTab, BottomNavTab, BottomNavTab, BottomNavTab] = [
  {
    key: "today",
    label: "Today",
    icon: <CalendarDays size={22} />,
    href: "/today",
  },
  {
    key: "plan",
    label: "Plan",
    icon: <CalendarRange size={22} />,
    href: "/plan",
  },
  {
    key: "board",
    label: "Board",
    icon: <SquareKanban size={22} />,
    href: "/board",
  },
  {
    key: "stats",
    label: "Stats",
    icon: <BarChart2 size={22} />,
    href: "/analytics",
  },
];

function pathToKey(pathname: string): string {
  if (pathname.startsWith("/analytics")) return "stats";
  if (pathname.startsWith("/settings")) return "profile";
  const seg = pathname.split("/")[1] ?? "today";
  return seg;
}

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeKey = pathToKey(pathname);
  const [captureOpen, setCaptureOpen] = useState(false);
  const { mode } = useLayout();

  const isOnboarding = pathname === "/onboarding";
  const hideChrome = isOnboarding || pathname.startsWith("/post/");

  const openCapture = () => setCaptureOpen(true);
  const closeCapture = () => setCaptureOpen(false);

  // ── Onboarding / focused editor: render bare, no shell chrome ──────────
  if (hideChrome) {
    return <div className={styles.mobileShell}>{children}</div>;
  }

  // ── DESKTOP layout (real wide viewport) ────────────────────────────────
  if (mode === "desktop") {
    return (
      <div className={styles.desktopShell}>
        <DesktopSidebar activeKey={activeKey} onQuickCapture={openCapture} />
        <div className={styles.desktopMain}>
          <main className={styles.desktopContent}>{children}</main>
        </div>
        <QuickCaptureSheet open={captureOpen} onClose={closeCapture} />
      </div>
    );
  }

  // ── MOBILE layout ──────────────────────────────────────────────────────
  return (
    <div className={styles.mobileShell}>
      <div className={styles.mobileScroll}>{children}</div>
      <BottomNav
        tabs={TABS}
        activeKey={activeKey}
        fabIcon={<Plus size={24} strokeWidth={2.4} />}
        fabLabel="Quick Capture"
        onFabClick={openCapture}
        className={styles.mobileNav}
      />
      <QuickCaptureSheet open={captureOpen} onClose={closeCapture} />
    </div>
  );
}
