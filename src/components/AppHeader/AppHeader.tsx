"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Bell, User } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { useNotifications } from "@/store/NotificationsContext";
import styles from "./AppHeader.module.css";

const TODAY_KICKER = "SAT · MAY 16 · WK 20";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function capitalizeFirst(str: string): string {
  return str.length > 0 ? (str[0]?.toUpperCase() ?? "") + str.slice(1) : str;
}

type AppHeaderVariant = "compact" | "prominent";

interface AppHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  title?: string;
  subtitle?: string;
  kicker?: string;
  variant?: AppHeaderVariant;
  /** Today screen: show greeting + date instead of a title bar */
  showGreeting?: boolean;
  /** Sub-line beneath the greeting (Today screen) */
  greetingSub?: string;
  style?: CSSProperties;
  /** Extra content inserted in the trailing actions zone, before the bell */
  trailingExtra?: ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  kicker,
  variant = "compact",
  showGreeting = false,
  greetingSub,
  style,
  trailingExtra,
  ...rest
}: AppHeaderProps) {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pp2-onboarding");
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string };
        const full = parsed.name?.trim() ?? "";
        setFirstName(full ? (full.split(" ")[0] ?? "") : "");
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const avatarLetter = firstName ? (firstName[0]?.toUpperCase() ?? "") : "";

  const actions = (
    <div className={styles.trailingActions}>
      {trailingExtra}
      <IconButton
        icon={<Bell size={20} />}
        label="Notifications"
        badge={unreadCount > 0}
        onClick={() => router.push("/notifications" as never)}
        size={40}
      />
      <button
        type="button"
        className={styles.avatar}
        onClick={() => router.push("/settings")}
        aria-label="Profile and settings"
      >
        {avatarLetter ? avatarLetter : <User size={18} />}
      </button>
    </div>
  );

  if (showGreeting) {
    return (
      <header
        className={styles.greetingHeader}
        style={style}
        aria-label="Home header"
        {...rest}
      >
        <div className={styles.greetingBlock}>
          <p className={styles.greetingKicker}>{TODAY_KICKER}</p>
          <p className={styles.greetingLine}>
            {getGreeting()}
            {firstName ? `, ${capitalizeFirst(firstName)}` : ""}.
          </p>
          {greetingSub ? (
            <p className={styles.greetingSub}>{greetingSub}</p>
          ) : null}
        </div>
        {actions}
      </header>
    );
  }

  return (
    <AppBar
      title={title ?? ""}
      subtitle={subtitle}
      kicker={kicker}
      variant={variant}
      trailing={actions}
      style={style}
      {...rest}
    />
  );
}
