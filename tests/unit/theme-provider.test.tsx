import { describe, it, expect, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/providers/ThemeProvider";

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button type="button" onClick={() => setTheme("dark")}>
        go-dark
      </button>
      <button type="button" onClick={() => setTheme("light")}>
        go-light
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.className = "pp2";
    window.localStorage.clear();
  });

  it("starts in auto and resolves to light when the system prefers light", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("auto");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("applies the dark class on <html> when the user picks dark", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("go-dark").click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("pp2-theme")).toBe("dark");
  });

  it("removes the dark class when the user picks light", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("go-dark").click();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await act(async () => {
      screen.getByText("go-light").click();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem("pp2-theme")).toBe("light");
  });

  it("survives a localStorage read that throws (privacy mode)", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });

    expect(() =>
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
      ),
    ).not.toThrow();

    if (original) {
      Object.defineProperty(window, "localStorage", original);
    }
  });
});
