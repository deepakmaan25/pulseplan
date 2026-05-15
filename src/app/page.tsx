export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "var(--s-10)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <p
          style={{
            font: "var(--t-label)",
            letterSpacing: "var(--ls-label)",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: "var(--s-6)",
          }}
        >
          PulsePlan · Milestone 0
        </p>
        <h1
          style={{
            font: "var(--t-display)",
            letterSpacing: "var(--ls-display)",
            color: "var(--ink-1)",
            marginBottom: "var(--s-8)",
          }}
        >
          Foundation is live.
        </h1>
        <p
          style={{
            font: "var(--t-body)",
            color: "var(--ink-2)",
            marginBottom: "var(--s-10)",
          }}
        >
          Tokens, fonts, and the app shell are wired. The component library,
          theme provider, and screens land in subsequent M0/M1 steps.
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: "var(--s-3)",
            padding: "var(--s-3) var(--s-6)",
            background: "var(--primary-soft)",
            color: "var(--primary-ink)",
            borderRadius: "var(--r-full)",
            font: "var(--t-caption)",
          }}
        >
          <span style={{ font: "var(--t-mono)" }}>pp2</span>
          <span>·</span>
          <span>tokens loaded</span>
        </div>
      </div>
    </main>
  );
}
