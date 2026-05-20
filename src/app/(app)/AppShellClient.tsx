"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  Columns3,
  BarChart2,
  Plus,
} from "lucide-react";
import { BottomNav, type BottomNavTab } from "@/components/ui";
import { QuickCaptureSheet } from "@/components/sheets/QuickCaptureSheet";
import { StatusBar } from "./StatusBar";
import styles from "./layout.module.css";

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
    icon: <Columns3 size={22} />,
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
  const seg = pathname.split("/")[1] ?? "today";
  return seg;
}

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeKey = pathToKey(pathname);
  const [captureOpen, setCaptureOpen] = useState(false);

  const isOnboarding = pathname === "/onboarding";
  const hideChrome =
    isOnboarding ||
    pathname.startsWith("/post/") ||
    pathname.startsWith("/notifications");

  return (
    <div className={styles.deviceBackground}>
      <div className={styles.device}>
        <StatusBar />
        <div className={styles.scrollArea}>{children}</div>
        {!hideChrome && (
          <BottomNav
            tabs={TABS}
            activeKey={activeKey}
            fabIcon={<Plus size={24} />}
            fabLabel="Quick Capture"
            onFabClick={() => setCaptureOpen(true)}
            className={styles.nav}
          />
        )}
      </div>
      {!hideChrome && (
        <QuickCaptureSheet
          open={captureOpen}
          onClose={() => setCaptureOpen(false)}
        />
      )}
    </div>
  );
}
