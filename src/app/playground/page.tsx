"use client";

import { useTheme, useToast } from "@/components/providers";
import { THEME_VALUES, type Theme } from "@/lib/theme/constants";

export default function PlaygroundPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "var(--s-12) var(--s-10)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--s-12)",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <header
        style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}
      >
        <p
          style={{
            font: "var(--t-label)",
            letterSpacing: "var(--ls-label)",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Playground
        </p>
        <h1
          style={{
            font: "var(--t-display)",
            letterSpacing: "var(--ls-display)",
            color: "var(--ink-1)",
          }}
        >
          Theme &amp; providers
        </h1>
        <p style={{ font: "var(--t-body)", color: "var(--ink-2)" }}>
          Validation surface for ThemeProvider, useTheme, and the ToastProvider
          shell. Components land in M1a; this page is intentionally minimal.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Theme</h2>
        <p style={{ font: "var(--t-body-sm)", color: "var(--ink-2)" }}>
          Setting · <code style={monoStyle}>{theme}</code> &nbsp; Resolved ·{" "}
          <code style={monoStyle}>{resolvedTheme}</code>
        </p>
        <div
          role="tablist"
          aria-label="Theme"
          style={{
            display: "inline-flex",
            padding: "var(--s-1)",
            background: "var(--bg-sunken)",
            border: "1px solid var(--divider)",
            borderRadius: "var(--r-full)",
          }}
        >
          {THEME_VALUES.map((value) => {
            const active = theme === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTheme(value as Theme)}
                style={{
                  appearance: "none",
                  border: 0,
                  cursor: "pointer",
                  padding: "var(--s-3) var(--s-8)",
                  borderRadius: "var(--r-full)",
                  font: "var(--t-button)",
                  color: active ? "var(--ink-inverse)" : "var(--ink-2)",
                  background: active ? "var(--ink-1)" : "transparent",
                  textTransform: "capitalize",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Toasts</h2>
        <p style={{ font: "var(--t-body-sm)", color: "var(--ink-2)" }}>
          Shell only. Replaced by the Snackbar primitive in M1a.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-4)" }}>
          <button
            type="button"
            onClick={() => toast("Saved to Essays")}
            style={primaryButtonStyle}
          >
            Plain toast
          </button>
          <button
            type="button"
            onClick={() =>
              toast({
                message: "Moved to Scheduled",
                tone: "primary",
                actionLabel: "UNDO",
                onAction: () => toast({ message: "Reverted", tone: "default" }),
              })
            }
            style={outlinedButtonStyle}
          >
            Toast with UNDO
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Surface swatches</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--s-4)",
          }}
        >
          {(["surface-1", "surface-2", "surface-3", "surface-4"] as const).map(
            (name) => (
              <div
                key={name}
                style={{
                  background: `var(--${name})`,
                  color: "var(--ink-2)",
                  border: "1px solid var(--divider)",
                  borderRadius: "var(--r-md)",
                  padding: "var(--s-6)",
                  font: "var(--t-mono)",
                  textAlign: "center",
                }}
              >
                {name}
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--s-6)",
  padding: "var(--s-10)",
  background: "var(--surface-1)",
  border: "1px solid var(--divider)",
  borderRadius: "var(--r-lg)",
  boxShadow: "var(--e-1)",
};

const sectionTitleStyle: React.CSSProperties = {
  font: "var(--t-title)",
  letterSpacing: "var(--ls-title)",
  color: "var(--ink-1)",
  margin: 0,
};

const monoStyle: React.CSSProperties = {
  font: "var(--t-mono)",
  background: "var(--bg-sunken)",
  padding: "1px 6px",
  borderRadius: "var(--r-xs)",
  color: "var(--ink-1)",
};

const primaryButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: 0,
  cursor: "pointer",
  padding: "var(--s-5) var(--s-9)",
  borderRadius: "var(--r-md)",
  font: "var(--t-button)",
  color: "var(--ink-inverse)",
  background: "var(--primary)",
};

const outlinedButtonStyle: React.CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  padding: "var(--s-5) var(--s-9)",
  borderRadius: "var(--r-md)",
  font: "var(--t-button)",
  color: "var(--ink-1)",
  background: "transparent",
  border: "1px solid var(--outline-strong)",
};
