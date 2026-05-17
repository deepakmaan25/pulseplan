import styles from "./today.module.css";

export default function TodayLoading() {
  return (
    <div>
      {/* Header */}
      <div className={styles.homeHeader} style={{ paddingTop: "var(--s-4)" }}>
        <span
          className="pp2-skel"
          style={{ width: 88, height: 18, display: "block", borderRadius: 6 }}
        />
      </div>

      <div className={styles.content}>
        {/* Greeting */}
        <div className={styles.greeting}>
          <div
            className="pp2-skel"
            style={{ width: "52%", height: 26, marginBottom: "var(--s-2)" }}
          />
          <div className="pp2-skel" style={{ width: "36%", height: 14 }} />
        </div>

        {/* Stat pills */}
        <div className={styles.statsRow} aria-hidden="true">
          {([0, 1, 2] as const).map((i) => (
            <div
              key={i}
              className="pp2-skel"
              style={{
                width: 72,
                height: 62,
                borderRadius: "var(--r-lg)",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Post row skeletons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--s-3)",
            padding: "0 var(--s-9)",
          }}
        >
          {([0, 1, 2] as const).map((i) => (
            <div
              key={i}
              className="pp2-skel"
              style={{ height: 80, borderRadius: "var(--r-lg)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
