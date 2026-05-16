"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import styles from "./onboarding.module.css";

// ── Data ──────────────────────────────────────────────────────

type Cadence = "daily" | "3x" | "2x" | "weekly";

const PILLAR_OPTIONS = [
  { id: "business", name: "Business", color: "#0e9f6e" },
  { id: "mindset", name: "Mindset", color: "#2e5bff" },
  { id: "tech", name: "Tech & Tools", color: "#6d28d9" },
  { id: "personal", name: "Personal Brand", color: "#d97706" },
  { id: "education", name: "Education", color: "#0284c7" },
  { id: "lifestyle", name: "Lifestyle", color: "#c13584" },
  { id: "finance", name: "Finance", color: "#0e9f6e" },
  { id: "health", name: "Health", color: "#dc2626" },
] as const;

const PLATFORM_OPTIONS: { value: Platform; label: string; color: string }[] = [
  { value: "ig", label: "Instagram", color: "#c13584" },
  { value: "li", label: "LinkedIn", color: "#0a66c2" },
  { value: "x", label: "X / Twitter", color: "#0a0d12" },
  { value: "yt", label: "YouTube", color: "#dc2626" },
  { value: "th", label: "Threads", color: "#4b5563" },
];

const CADENCE_OPTIONS: { value: Cadence; label: string; sub: string }[] = [
  { value: "daily", label: "Daily", sub: "7 posts per week" },
  { value: "3x", label: "3× per week", sub: "Consistent and sustainable" },
  { value: "2x", label: "2× per week", sub: "Quality over quantity" },
  { value: "weekly", label: "Weekly", sub: "One polished post per week" },
];

const CADENCE_LABELS: Record<Cadence, string> = {
  daily: "7 posts / week",
  "3x": "3 posts / week",
  "2x": "2 posts / week",
  weekly: "1 post / week",
};

// ── Main component ──────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [pillars, setPillars] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [cadence, setCadence] = useState<Cadence | null>(null);

  // Skip if already completed
  useEffect(() => {
    try {
      if (localStorage.getItem("pp2-onboarded")) {
        router.replace("/today");
      }
    } catch {
      // localStorage unavailable — proceed normally
    }
  }, [router]);

  const togglePillar = useCallback((id: string) => {
    setPillars((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev,
    );
  }, []);

  const togglePlatform = useCallback((p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }, []);

  function complete() {
    try {
      localStorage.setItem(
        "pp2-onboarding",
        JSON.stringify({ pillars, platforms, cadence }),
      );
      localStorage.setItem("pp2-onboarded", "1");
    } catch {
      // continue even if storage fails
    }
    router.push("/today");
  }

  if (step === 0) {
    return <WelcomeStep onNext={() => setStep(1)} />;
  }

  if (step === 1) {
    return (
      <PillarsStep
        pillars={pillars}
        onToggle={togglePillar}
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <PlatformsStep
        platforms={platforms}
        onToggle={togglePlatform}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      />
    );
  }

  if (step === 3) {
    return (
      <CadenceStep
        cadence={cadence}
        onSelect={setCadence}
        onBack={() => setStep(2)}
        onNext={() => setStep(4)}
      />
    );
  }

  return (
    <DoneStep
      pillars={pillars}
      platforms={platforms}
      cadence={cadence}
      onComplete={complete}
    />
  );
}

// ── Progress dots ──────────────────────────────────────────────

function ProgressDots({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div className={styles.progress} aria-hidden="true">
      {([1, 2, 3] as const).map((n) => (
        <span
          key={n}
          className={`${styles.dot} ${active === n ? styles.dotActive : ""}`}
        />
      ))}
    </div>
  );
}

// ── Step: Welcome ──────────────────────────────────────────────

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <CalendarDays size={32} strokeWidth={1.5} />
        </div>
        <span className={styles.heroWordmark}>PulsePlan</span>
      </div>

      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeHeading}>Your content,{"\n"}organized.</h1>
        <p className={styles.welcomeSub}>
          Plan posts across every platform. Build consistent creator habits.
          Ship content that grows your audience.
        </p>
        <div className={styles.footer}>
          <Button
            variant="filled"
            size="lg"
            onClick={onNext}
            style={{ width: "100%" }}
          >
            Get Started
            <ChevronRight size={18} style={{ marginLeft: 4 }} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Pillars ────────────────────────────────────────────

function PillarsStep({
  pillars,
  onToggle,
  onBack,
  onNext,
}: {
  pillars: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.screen}>
      <ProgressDots active={1} />

      <div className={styles.stepScreen}>
        <div>
          <h2 className={styles.stepHeading}>What do you{"\n"}create about?</h2>
          <p className={styles.stepSub}>Pick up to 4 content pillars.</p>
        </div>

        <div className={styles.pillarsGrid}>
          {PILLAR_OPTIONS.map(({ id, name, color }) => {
            const selected = pillars.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(id)}
                className={`${styles.pillarOption} ${selected ? styles.pillarOptionSelected : ""}`}
              >
                <span
                  className={styles.pillarDot}
                  style={{ background: color }}
                />
                <span className={styles.pillarName}>{name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            variant="filled"
            size="lg"
            onClick={onNext}
            disabled={pillars.length === 0}
            style={{ width: "100%" }}
          >
            Continue
          </Button>
          <Button
            variant="text"
            size="md"
            onClick={onBack}
            style={{ width: "100%" }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Platforms ──────────────────────────────────────────

function PlatformsStep({
  platforms,
  onToggle,
  onBack,
  onNext,
}: {
  platforms: Platform[];
  onToggle: (p: Platform) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.screen}>
      <ProgressDots active={2} />

      <div className={styles.stepScreen}>
        <div>
          <h2 className={styles.stepHeading}>Where do you{"\n"}publish?</h2>
          <p className={styles.stepSub}>Select all that apply.</p>
        </div>

        <div className={styles.platformList}>
          {PLATFORM_OPTIONS.map(({ value, label, color }) => {
            const selected = platforms.includes(value);
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(value)}
                className={`${styles.platformOption} ${selected ? styles.platformOptionSelected : ""}`}
              >
                <div className={styles.platformLeft}>
                  <span
                    className={styles.platformDot}
                    style={{ background: color }}
                  />
                  <span className={styles.platformLabel}>{label}</span>
                </div>
                <span className={styles.platformCheck} aria-hidden="true">
                  {selected ? <Check size={12} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            variant="filled"
            size="lg"
            onClick={onNext}
            disabled={platforms.length === 0}
            style={{ width: "100%" }}
          >
            Continue
          </Button>
          <Button
            variant="text"
            size="md"
            onClick={onBack}
            style={{ width: "100%" }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Cadence ────────────────────────────────────────────

function CadenceStep({
  cadence,
  onSelect,
  onBack,
  onNext,
}: {
  cadence: Cadence | null;
  onSelect: (c: Cadence) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.screen}>
      <ProgressDots active={3} />

      <div className={styles.stepScreen}>
        <div>
          <h2 className={styles.stepHeading}>How often do{"\n"}you post?</h2>
          <p className={styles.stepSub}>
            You can change this any time in Settings.
          </p>
        </div>

        <div className={styles.cadenceList}>
          {CADENCE_OPTIONS.map(({ value, label, sub }) => {
            const selected = cadence === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(value)}
                className={`${styles.cadenceOption} ${selected ? styles.cadenceOptionSelected : ""}`}
              >
                <span className={styles.cadenceLabel}>{label}</span>
                <span className={styles.cadenceSub}>{sub}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            variant="filled"
            size="lg"
            onClick={onNext}
            disabled={cadence === null}
            style={{ width: "100%" }}
          >
            Continue
          </Button>
          <Button
            variant="text"
            size="md"
            onClick={onBack}
            style={{ width: "100%" }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Done ───────────────────────────────────────────────

function DoneStep({
  pillars,
  platforms,
  cadence,
  onComplete,
}: {
  pillars: string[];
  platforms: Platform[];
  cadence: Cadence | null;
  onComplete: () => void;
}) {
  const pillarCount = pillars.length || 1;
  const platformCount = platforms.length || 1;
  const cadenceLabel = cadence ? CADENCE_LABELS[cadence] : "3 posts / week";

  return (
    <div className={`${styles.screen} ${styles.doneScreen}`}>
      <div className={styles.doneIcon}>
        <Sparkles size={36} strokeWidth={1.5} />
      </div>

      <div>
        <h2 className={styles.doneHeading}>You&apos;re all set!</h2>
      </div>

      <div className={styles.doneSummary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryDot} />
          <span>
            {pillarCount} content pillar{pillarCount !== 1 ? "s" : ""} selected
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryDot} />
          <span>
            {platformCount} platform{platformCount !== 1 ? "s" : ""} connected
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryDot} />
          <span>Goal: {cadenceLabel}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="filled"
          size="lg"
          onClick={onComplete}
          style={{ width: "100%" }}
        >
          Open My Planner
          <ChevronRight size={18} style={{ marginLeft: 4 }} />
        </Button>
      </div>
    </div>
  );
}
