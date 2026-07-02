"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  CalendarDays,
  CalendarRange,
  SquareKanban,
  BarChart2,
  User,
  Plus,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui";
import styles from "./DesktopSidebar.module.css";

export interface SidebarNavItem {
  key: string;
  label: string;
  href: Route;
  icon: React.ReactNode;
}

const NAV: SidebarNavItem[] = [
  {
    key: "today",
    label: "Today",
    href: "/today" as Route,
    icon: <CalendarDays size={18} />,
  },
  {
    key: "plan",
    label: "Plan",
    href: "/plan" as Route,
    icon: <CalendarRange size={18} />,
  },
  {
    key: "board",
    label: "Board",
    href: "/board" as Route,
    icon: <SquareKanban size={18} />,
  },
  {
    key: "stats",
    label: "Stats",
    href: "/analytics" as Route,
    icon: <BarChart2 size={18} />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/settings" as Route,
    icon: <User size={18} />,
  },
];

export function DesktopSidebar({
  activeKey,
  onQuickCapture,
}: {
  activeKey: string;
  onQuickCapture: () => void;
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <Activity size={18} strokeWidth={2.5} />
        </span>
        <span className={styles.brandName}>PulsePlan</span>
      </div>

      <Button
        variant="filled"
        size="md"
        leadingIcon={<Plus size={16} strokeWidth={2.4} />}
        onClick={onQuickCapture}
        className={styles.capture}
      >
        Quick Capture
      </Button>

      <nav className={styles.nav} aria-label="Primary">
        {NAV.map((item) => {
          const active = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={styles.navItem}
              data-active={active || undefined}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
