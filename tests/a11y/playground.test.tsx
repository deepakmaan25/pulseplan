import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { AppProviders } from "@/components/providers";
import PlaygroundPage from "@/app/playground/page";

describe("/playground accessibility", () => {
  beforeEach(() => {
    document.documentElement.className = "pp2";
  });

  it("has no axe-core violations in the light theme", async () => {
    const { container } = render(
      <AppProviders>
        <PlaygroundPage />
      </AppProviders>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe-core violations in the dark theme", async () => {
    document.documentElement.classList.add("dark");
    const { container } = render(
      <AppProviders>
        <PlaygroundPage />
      </AppProviders>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
