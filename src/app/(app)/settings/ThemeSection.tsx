"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Segmented } from "@/components/ui/Segmented/Segmented";
import type { Theme } from "@/lib/theme/constants";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "auto", label: "Auto" },
  { value: "dark", label: "Dark" },
];

export function ThemeSection() {
  const { theme, setTheme } = useTheme();
  return (
    <Segmented
      options={OPTIONS}
      value={theme}
      onChange={setTheme}
      ariaLabel="Color theme"
    />
  );
}
