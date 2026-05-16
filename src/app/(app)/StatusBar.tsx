"use client";

import { useEffect, useState } from "react";
import { Signal, Wifi, Battery } from "lucide-react";
import styles from "./layout.module.css";

function fmt(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function StatusBar() {
  const [time, setTime] = useState(fmt(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(fmt(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.statusBar} aria-hidden="true">
      <span className={styles.statusTime}>{time}</span>
      <div className={styles.dynamicIsland} />
      <div className={styles.statusIcons}>
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <Battery size={13} strokeWidth={2.5} />
      </div>
    </div>
  );
}
