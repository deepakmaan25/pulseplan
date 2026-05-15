import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { AppProviders } from "@/components/providers";
import PlaygroundPage from "@/app/playground/page";

describe("/playground accessibility", () => {
  it("has no axe-core violations in the default (light) theme", async () => {
    document.documentElement.className = "pp2";
    const { container } = render(
      <AppProviders>
        <PlaygroundPage />
      </AppProviders>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
