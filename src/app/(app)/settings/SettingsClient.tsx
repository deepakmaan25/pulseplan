"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Button } from "@/components/ui/Button/Button";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import { createClient } from "@/lib/supabase/client";
import { ThemeSection } from "./ThemeSection";
import styles from "./settings.module.css";

type Cadence = "daily" | "5x" | "3x" | "2x" | "weekly";

const CADENCE_OPTIONS: { value: Cadence; label: string; sub: string }[] = [
  { value: "daily", label: "Daily", sub: "7× per week" },
  { value: "5x", label: "5× per week", sub: "" },
  { value: "3x", label: "3× per week", sub: "" },
  { value: "2x", label: "2× per week", sub: "" },
  { value: "weekly", label: "Weekly", sub: "1× per week" },
];

const CADENCE_DISPLAY: Record<Cadence, string> = {
  daily: "Daily (7× / week)",
  "5x": "5× per week",
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

function readOnboarding(): {
  name: string;
  platforms: Platform[];
  cadence: Cadence | null;
} {
  try {
    const raw = localStorage.getItem("pp2-onboarding");
    if (!raw) return { name: "", platforms: [], cadence: null };
    const parsed = JSON.parse(raw) as {
      name?: string;
      platforms?: Platform[];
      cadence?: Cadence;
    };
    return {
      name: parsed.name ?? "",
      platforms: Array.isArray(parsed.platforms) ? parsed.platforms : [],
      cadence: parsed.cadence ?? null,
    };
  } catch {
    return { name: "", platforms: [], cadence: null };
  }
}

function writeOnboarding(patch: {
  name?: string;
  platforms?: Platform[];
  cadence?: Cadence;
}) {
  try {
    const raw = localStorage.getItem("pp2-onboarding");
    const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    localStorage.setItem(
      "pp2-onboarding",
      JSON.stringify({ ...existing, ...patch }),
    );
  } catch {
    // storage unavailable — state still updates in memory
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
    // storage unavailable
  }
}

function capitalizeFirst(str: string): string {
  return str.length > 0 ? (str[0]?.toUpperCase() ?? "") + str.slice(1) : str;
}

export function SettingsClient({ email }: { email?: string }) {
  const router = useRouter();

  // Core profile state
  const [name, setName] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [cadence, setCadence] = useState<Cadence | null>(null);
  const [overdueAlert, setOverdueAlert] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // Profile edit sheet
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Cadence picker sheet
  const [cadenceOpen, setCadenceOpen] = useState(false);
  const [pendingCadence, setPendingCadence] = useState<Cadence | null>(null);

  // Platform connect sheet
  const [connectPlatform, setConnectPlatform] = useState<Platform | null>(null);
  const [connectHandle, setConnectHandle] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Platform disconnect sheet
  const [disconnectPlatform, setDisconnectPlatform] =
    useState<Platform | null>(null);

  useEffect(() => {
    const data = readOnboarding();
    setName(data.name);
    setPlatforms(data.platforms);
    setCadence(data.cadence);
    setOverdueAlert(readOverdueAlert());
  }, []);

  // ── Handlers ────────────────────────────────────────────────────

  async function handleSignOut() {
    setSigningOut(true);
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.refresh();
    router.push("/auth");
  }

  function toggleOverdue() {
    const next = !overdueAlert;
    setOverdueAlert(next);
    writeOverdueAlert(next);
  }

  function openEditProfile() {
    setEditName(name);
    setEditEmail(email ?? "");
    setEditProfileOpen(true);
  }

  function saveProfile() {
    const trimmed = editName.trim();
    setName(trimmed);
    writeOnboarding({ name: trimmed });
    setEditProfileOpen(false);
  }

  function openCadencePicker() {
    setPendingCadence(cadence);
    setCadenceOpen(true);
  }

  function saveCadence() {
    if (pendingCadence) {
      setCadence(pendingCadence);
      writeOnboarding({ cadence: pendingCadence });
    }
    setCadenceOpen(false);
  }

  function openConnect(platform: Platform) {
    setConnectHandle("");
    setConnecting(false);
    setConnectPlatform(platform);
  }

  function handleConnect() {
    if (!connectPlatform) return;
    setConnecting(true);
    window.setTimeout(() => {
      const next = [...platforms, connectPlatform];
      setPlatforms(next);
      writeOnboarding({ platforms: next });
      setConnecting(false);
      setConnectPlatform(null);
    }, 500);
  }

  function openDisconnect(platform: Platform) {
    setDisconnectPlatform(platform);
  }

  function handleDisconnect() {
    if (!disconnectPlatform) return;
    const next = platforms.filter((p) => p !== disconnectPlatform);
    setPlatforms(next);
    writeOnboarding({ platforms: next });
    setDisconnectPlatform(null);
  }

  // ── Derived ──────────────────────────────────────────────────────

  const connectedPlatforms = ALL_PLATFORMS.filter((p) =>
    platforms.includes(p.value),
  );
  const otherPlatforms = ALL_PLATFORMS.filter(
    (p) => !platforms.includes(p.value),
  );

  const connectPlatformLabel =
    ALL_PLATFORMS.find((p) => p.value === connectPlatform)?.label ?? "";
  const disconnectPlatformLabel =
    ALL_PLATFORMS.find((p) => p.value === disconnectPlatform)?.label ?? "";

  return (
    <div>
      <AppHeader title="Settings" style={{ paddingTop: "var(--s-4)" }} />

      <div className={styles.content}>
        {/* Profile */}
        <section aria-labelledby="profile-heading">
          <p id="profile-heading" className={styles.groupLabel}>
            Profile
          </p>
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.avatar} aria-hidden="true">
              {(name || email || "?")[0]?.toUpperCase() ?? "?"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className={styles.profileName}>
                {name ? capitalizeFirst(name) : email || "Your Profile"}
              </p>
              {name && email && <p className={styles.profileHandle}>{email}</p>}
            </div>
            <button
              type="button"
              className={styles.editBtn}
              onClick={openEditProfile}
              aria-label="Edit profile"
            >
              Edit
            </button>
          </div>
        </section>

        {/* Content goal */}
        <section aria-labelledby="goal-heading">
          <p id="goal-heading" className={styles.groupLabel}>
            Content goal
          </p>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Publishing cadence</span>
              <button
                type="button"
                className={styles.editRowBtn}
                onClick={openCadencePicker}
              >
                {cadence ? CADENCE_DISPLAY[cadence] : "Not set"}
              </button>
            </div>
          </div>
        </section>

        {/* Connected platforms */}
        <section aria-labelledby="platforms-heading">
          <p id="platforms-heading" className={styles.groupLabel}>
            Connected platforms
          </p>
          <div className={styles.card}>
            {connectedPlatforms.map(({ value }) => (
              <div key={value} className={styles.platformRow}>
                <PlatformChip platform={value} showLabel size="md" />
                <button
                  type="button"
                  className={`${styles.connBadge} ${styles.connBadgeOn}`}
                  onClick={() => openDisconnect(value)}
                >
                  Connected
                </button>
              </div>
            ))}
            {otherPlatforms.map(({ value }) => (
              <div key={value} className={styles.platformRow}>
                <PlatformChip platform={value} showLabel size="md" />
                <button
                  type="button"
                  className={styles.connBadge}
                  onClick={() => openConnect(value)}
                >
                  Connect
                </button>
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

        {/* Account */}
        <section aria-labelledby="account-heading">
          <p id="account-heading" className={styles.groupLabel}>
            Account
          </p>
          <div className={styles.card}>
            <div className={styles.row}>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className={`${styles.signOutBtn} pp2-press`}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Edit profile sheet ─────────────────────────────────── */}
      <Sheet
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Profile"
        footer={
          <Button
            variant="filled"
            size="lg"
            fullWidth
            onClick={saveProfile}
          >
            Save
          </Button>
        }
      >
        <div className={styles.sheetForm}>
          <label className={styles.fieldLabel} htmlFor="edit-name">
            Name
          </label>
          <input
            id="edit-name"
            type="text"
            className={styles.fieldInput}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
          {email && (
            <>
              <label className={styles.fieldLabel} htmlFor="edit-email">
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                className={`${styles.fieldInput} ${styles.fieldInputReadOnly}`}
                value={editEmail}
                readOnly
                aria-readonly="true"
              />
              <p className={styles.fieldCaption}>
                Email is managed by your account provider.
              </p>
            </>
          )}
        </div>
      </Sheet>

      {/* ── Cadence picker sheet ───────────────────────────────── */}
      <Sheet
        open={cadenceOpen}
        onClose={() => setCadenceOpen(false)}
        title="Publishing Cadence"
        footer={
          <Button
            variant="filled"
            size="lg"
            fullWidth
            onClick={saveCadence}
            disabled={!pendingCadence}
          >
            Save
          </Button>
        }
      >
        <div className={styles.cadenceList}>
          {CADENCE_OPTIONS.map(({ value, label, sub }) => (
            <button
              key={value}
              type="button"
              className={`${styles.cadenceOption} ${pendingCadence === value ? styles.cadenceOptionSelected : ""}`}
              onClick={() => setPendingCadence(value)}
            >
              <span className={styles.cadenceLabel}>{label}</span>
              {sub ? (
                <span className={styles.cadenceSub}>{sub}</span>
              ) : null}
              <span
                className={`${styles.cadenceRadio} ${pendingCadence === value ? styles.cadenceRadioOn : ""}`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </Sheet>

      {/* ── Platform connect sheet ─────────────────────────────── */}
      <Sheet
        open={connectPlatform !== null}
        onClose={() => setConnectPlatform(null)}
        title={`Connect ${connectPlatformLabel}`}
        footer={
          <Button
            variant="filled"
            size="lg"
            fullWidth
            onClick={handleConnect}
            loading={connecting}
            disabled={!connectHandle.trim() || connecting}
          >
            {connecting ? "Connecting…" : "Connect"}
          </Button>
        }
      >
        <div className={styles.sheetForm}>
          <label className={styles.fieldLabel} htmlFor="connect-handle">
            Username or handle
          </label>
          <input
            id="connect-handle"
            type="text"
            className={styles.fieldInput}
            value={connectHandle}
            onChange={(e) => setConnectHandle(e.target.value)}
            placeholder={`@your${connectPlatformLabel.toLowerCase().replace(/[^a-z]/g, "")}handle`}
            autoCapitalize="none"
            autoComplete="off"
          />
          <p className={styles.fieldCaption}>
            This connects your {connectPlatformLabel} account for scheduling
            reminders. No posting permissions are requested.
          </p>
        </div>
      </Sheet>

      {/* ── Platform disconnect sheet ──────────────────────────── */}
      <Sheet
        open={disconnectPlatform !== null}
        onClose={() => setDisconnectPlatform(null)}
        title={`Disconnect ${disconnectPlatformLabel}?`}
        kicker="Destructive action"
        footer={
          <div className={styles.disconnectFooter}>
            <Button
              variant="outlined"
              size="lg"
              fullWidth
              onClick={() => setDisconnectPlatform(null)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              danger
              size="lg"
              fullWidth
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        }
      >
        <p className={styles.disconnectBody}>
          Removing {disconnectPlatformLabel} will stop scheduling reminders for
          this platform. You can reconnect at any time.
        </p>
      </Sheet>
    </div>
  );
}
