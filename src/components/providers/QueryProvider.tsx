"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query defaults — intentional, conservative starting point.
 * These were chosen before real data flows exist (M2c) and should be
 * revisited when we wire actual queries:
 *
 *   - staleTime: 30s
 *       Reasonable freshness for planning data. Posts list / pillars
 *       change rarely; we can raise per-query at the call site for
 *       slow-moving reads (e.g. user profile).
 *   - gcTime: 5min
 *       Standard. Keeps recently unmounted screens warm during back
 *       navigation.
 *   - retry: 1 (queries) / 0 (mutations)
 *       Mutations are deliberate user actions — surface failure
 *       immediately rather than silently retrying.
 *   - refetchOnWindowFocus: false
 *       Avoids surprise refetches on a mobile-first app where focus
 *       fires on every keyboard event. Re-enable per-query if a screen
 *       truly needs live data.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
