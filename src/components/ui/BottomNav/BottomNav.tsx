"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./BottomNav.module.css";

export interface BottomNavTab {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BottomNavProps {
  tabs: [BottomNavTab, BottomNavTab, BottomNavTab, BottomNavTab];
  activeKey: string;
  fabIcon: ReactNode;
  fabLabel: string;
  onFabClick: () => void;
  className?: string;
}

export function BottomNav({
  tabs,
  activeKey,
  fabIcon,
  fabLabel,
  onFabClick,
  className,
}: BottomNavProps) {
  const [today, plan, board, stats] = tabs;
  return (
    <nav aria-label="Primary" className={`${styles.nav} ${className ?? ""}`}>
      <Tab tab={today} active={activeKey === today.key} />
      <Tab tab={plan} active={activeKey === plan.key} />
      <div className={styles.fabWrap}>
        <button
          type="button"
          className={`${styles.fab} pp2-press`}
          aria-label={fabLabel}
          onClick={onFabClick}
        >
          <span aria-hidden="true">{fabIcon}</span>
        </button>
      </div>
      <Tab tab={board} active={activeKey === board.key} />
      <Tab tab={stats} active={activeKey === stats.key} />
    </nav>
  );
}

function Tab({ tab, active }: { tab: BottomNavTab; active: boolean }) {
  const Common = (
    <>
      <span aria-hidden="true">{tab.icon}</span>
      <span className={styles.label}>{tab.label}</span>
    </>
  );
  if (tab.href) {
    return (
      <Link
        href={tab.href}
        className={`${styles.tab} pp2-press`}
        aria-current={active ? "page" : undefined}
      >
        {Common}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={tab.onClick}
      className={`${styles.tab} pp2-press`}
      aria-current={active ? "page" : undefined}
    >
      {Common}
    </button>
  );
}
