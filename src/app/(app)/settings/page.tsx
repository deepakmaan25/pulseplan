import { AppBar } from "@/components/ui/AppBar/AppBar";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import { ThemeSection } from "./ThemeSection";
import styles from "./settings.module.css";

const PLATFORMS: { value: Platform; connected: boolean }[] = [
  { value: "ig", connected: true },
  { value: "li", connected: true },
  { value: "x", connected: false },
  { value: "yt", connected: false },
  { value: "th", connected: false },
];

export default function SettingsPage() {
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

        {/* Platforms */}
        <section aria-labelledby="platforms-heading">
          <p id="platforms-heading" className={styles.groupLabel}>
            Connected Platforms
          </p>
          <div className={styles.card}>
            {PLATFORMS.map(({ value, connected }) => (
              <div key={value} className={styles.platformRow}>
                <PlatformChip platform={value} showLabel size="md" />
                <span
                  className={`${styles.connBadge} ${connected ? styles.connBadgeOn : ""}`}
                >
                  {connected ? "Connected" : "Connect"}
                </span>
              </div>
            ))}
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
              <span className={styles.rowValue}>0.1.0-M1b</span>
            </div>
            <div className={`${styles.row} ${styles.rowBorder}`}>
              <span className={styles.rowLabel}>Milestone</span>
              <span className={styles.rowValue}>M1b — Static screens</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
