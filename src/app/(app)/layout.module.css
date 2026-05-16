/* ─── Desktop: centered phone on a muted canvas ─────────────── */
.deviceBackground {
  min-height: 100dvh;
  background: var(--bg-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.device {
  width: 390px;
  height: min(844px, calc(100dvh - 48px));
  border-radius: 44px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
  box-shadow:
    0 0 0 1px rgba(10, 13, 18, 0.08),
    0 8px 24px rgba(10, 13, 18, 0.1),
    0 32px 80px rgba(10, 13, 18, 0.2);
  position: relative;
}

/* ─── Fake status bar ────────────────────────────────────────── */
.statusBar {
  flex-shrink: 0;
  height: 44px;
  background: var(--surface-1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: relative;
}

.statusTime {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
  color: var(--ink-1);
  /* Give it exactly the same width always so dynamic island stays centered */
  width: 48px;
}

.dynamicIsland {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 118px;
  height: 34px;
  background: var(--ink-1);
  border-radius: 20px;
  pointer-events: none;
}

.statusIcons {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ink-1);
  width: 48px;
  justify-content: flex-end;
}

/* ─── Scrollable content area ────────────────────────────────── */
.scrollArea {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  background: var(--bg-base);
  /* Override AppBar's built-in status-bar clearance since the shell handles it */
  --appbar-top-inset: var(--s-4);
}

/* ─── Bottom nav sits outside scroll area ───────────────────── */
.nav {
  flex-shrink: 0;
  /* BottomNav uses position:sticky — override since it's already at the bottom of a flex column */
  position: relative !important;
}

/* ─── Mobile: fill the real viewport, drop all chrome ───────── */
@media (max-width: 430px) {
  .deviceBackground {
    padding: 0;
    background: var(--bg-base);
    align-items: stretch;
  }

  .device {
    width: 100%;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
    box-shadow: none;
  }

  .statusBar {
    display: none;
  }

  .scrollArea {
    /* Real safe-area covers the status bar on native mobile */
    padding-top: env(safe-area-inset-top);
    --appbar-top-inset: 0px;
  }
}
