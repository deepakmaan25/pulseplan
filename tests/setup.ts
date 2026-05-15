import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom does not implement matchMedia. Provide a safe default that resolves
// to "light" (not matching) and supports the addEventListener API that
// ThemeProvider relies on. Individual tests can override `window.matchMedia`
// with `vi.fn()` to assert on the listener wiring.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
});
