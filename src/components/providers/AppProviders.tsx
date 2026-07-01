"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LayoutProvider } from "./LayoutProvider";
import type { LayoutPref } from "@/lib/layout/constants";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({
  children,
  initialLayoutPref,
}: {
  children: ReactNode;
  initialLayoutPref?: LayoutPref;
}) {
  return (
    <ThemeProvider>
      <LayoutProvider initialPref={initialLayoutPref}>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
