import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import styles from "./KPI.module.css";

export type KPITrend = "up" | "down" | "flat";

export interface KPIProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: KPITrend;
  className?: string;
}

export function KPI({
  label,
  value,
  unit,
  delta,
  trend = "flat",
  className,
}: KPIProps) {
  const TrendIcon =
    trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  return (
    <div className={`${styles.card} tabnum ${className ?? ""}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.figure}>
        {value}
        {unit ? <span className={styles.unit}>{unit}</span> : null}
      </span>
      {delta ? (
        <span className={styles.delta} data-trend={trend}>
          <TrendIcon aria-hidden="true" />
          {delta}
        </span>
      ) : null}
    </div>
  );
}
