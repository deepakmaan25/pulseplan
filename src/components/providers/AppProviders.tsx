"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LayoutProvider } from "./LayoutProvider";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
