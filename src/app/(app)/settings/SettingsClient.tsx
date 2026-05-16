"use client";

import { useEffect, useState } from "react";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import { ThemeSection } from "./ThemeSection";
import styles from "./settings.module.css";

type Cadence = "daily" | "3x" | "2x" | "weekly";

const CADENCE_LABELS: Record<Cadence, string> = {
  daily: "Daily (7× / week)",
  "3x": "3× per week",
  "2x": "2× per week",
  weekly: "Weekly",
};

const ALL_PLATFORMS: { value: Platform; label: string }[] = [
  { value: "ig", label: "Instagram" },
  { value: "li", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "yt", label: "YouTube" },
  { value: "th", label: "Threads" },
];

function readOnboarding(): { platforms: Platform[]; cadence: Cadence | null } {
  try {
    const raw = localStorage.getItem("pp2-onboarding");
    if (!raw) return { platforms: [], cadence: null };
    const parsed = JSON.parse(raw) as {
      platforms?: Platform[];
      cadence?: Cadence;
    };
    return {
      platforms: Array.isArray(parsed.platforms) ? parsed.platforms : [],
      cadence: parsed.cadence ?? null,
    };
  } catch {
    return { platforms: [], cadence: null };
  }
}

function readOverdueAlert(): boolean {
  try {
    return localStorage.getItem("pp2-notif-overdue") !== "0";
  } catch {
    return true;
  }
}

function writeOverdueAlert(enabled: boolean) {
  try {
    localStorage.setItem("pp2-notif-overdue", enabled ? "1" : "0");
  } catch {
    // storage unavailable — state still updates in memory
  }
}

export function SettingsClient() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [cadence, setCadence] = useState<Cadence | null>(null);
  const [overdueAlert, setOverdueAlert] = useState(true);

  useEffect(() => {
    const data = readOnboarding();
    setPlatforms(data.platforms);
    setCadence(data.cadence);
    setOverdueAlert(readOverdueAlert());
  }, []);

  function toggleOverdue() {
    const next = !overdueAlert;
    setOverdueAlert(next);
    writeOverdueAlert(next);
  }

  const connectedPlatforms = ALL_PLATFORMS.filter((p) =>
    platforms.includes(p.value),
  );
  const otherPlatforms = ALL_PLATFORMS.filter(
    (p) => !platforms.includes(p.value),
  );

  return (
    <div>
      <AppBar
        variant="compact"
        title="Settings"
        style={{ paddingTop: "var(--s-4)" }}
      />

      <div className={styles.content}>
        {/* Profile */}
        <section aria-labelledby="profile-heading">
          <p id="profile-heading" className={styles.groupLabel}>
            Profile
          </p>
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.avatar} aria-hidden="true">
              A
            </div>
            <div>
              <p className={styles.profileName}>Alex Creator</p>
              <p className={styles.profileHandle}>@alexcreates</p>
            </div>
          </div>
        </section>

        {/* Content goal — only shown once onboarding data is available */}
        {cadence && (
          <section aria-labelledby="goal-heading">
            <p id="goal-heading" className={styles.groupLabel}>
              Content goal
            </p>
            <div className={styles.card}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Publishing cadence</span>
                <span className={styles.rowValue}>
                  {CADENCE_LABELS[cadence]}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Connected platforms — seeded from onboarding */}
        <section aria-labelledby="platforms-heading">
          <p id="platforms-heading" className={styles.groupLabel}>
            Connected platforms
          </p>
          <div className={styles.card}>
            {connectedPlatforms.map(({ value }) => (
              <div key={value} className={styles.platformRow}>
                <PlatformChip platform={value} showLabel size="md" />
                <span className={`${styles.connBadge} ${styles.connBadgeOn}`}>
                  Connected
                </span>
              </div>
            ))}
            {otherPlatforms.map(({ value }) => (
              <div key={value} className={styles.platformRow}>
                <PlatformChip platform={value} showLabel size="md" />
                <span className={styles.connBadge}>Connect</span>
              </div>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section aria-labelledby="appearance-heading">
          <p id="appearance-heading" className={styles.groupLabel}>
            Appearance
          </p>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Theme</span>
              <ThemeSection />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section aria-labelledby="notif-heading">
          <p id="notif-heading" className={styles.groupLabel}>
            Notifications
          </p>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowStack}>
                <span className={styles.rowLabel}>Overdue alerts</span>
                <span className={styles.rowCaption}>
                  Remind me when posts miss their date
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={overdueAlert}
                onClick={toggleOverdue}
                className={`${styles.toggle} ${overdueAlert ? styles.toggleOn : ""}`}
              >
                <span className={styles.toggleThumb} />
                <span className="sr-only">
                  {overdueAlert ? "Disable" : "Enable"} overdue alerts
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section aria-labelledby="about-heading">
          <p id="about-heading" className={styles.groupLabel}>
            About
          </p>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Version</span>
              <span className={styles.rowValue}>0.2.0-M1c</span>
            </div>
            <div className={`${styles.row} ${styles.rowBorder}`}>
              <span className={styles.rowLabel}>Build</span>
              <span className={styles.rowValue}>Flight 5</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
