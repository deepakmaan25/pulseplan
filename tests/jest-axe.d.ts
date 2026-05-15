declare module "jest-axe" {
  export interface AxeViolation {
    id: string;
    impact?: "minor" | "moderate" | "serious" | "critical" | null;
    description: string;
    help: string;
    helpUrl: string;
    nodes: unknown[];
  }
  export interface AxeResults {
    violations: AxeViolation[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
  }
  export function axe(
    container: Element | Document,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>;
}
