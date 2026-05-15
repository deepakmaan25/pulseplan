# CLAUDE.md — orientation for AI coding agents

You are working on **PulsePlan**, a premium content planner for solo creators.
Read this file first, then read `HANDOFF.md` (visuals + product) and
`roadmap.md` (current milestone). Don't skip them — together they are the
authoritative spec.

---

## Working mode

- **Local-first.** Everything runs on the developer's machine before it
  ships. Vercel preview deploys only at meaningful checkpoints (end of M1b,
  M2c, then M4 production).
- **Milestone-based.** See `roadmap.md` for the current milestone and exit
  criteria. **Do not jump milestones.** Finish one before moving on.
- **Small, reviewable steps.** After each step:
  - explain what changed
  - list files touched
  - call out what remains in the current milestone
  - explain how to test locally
- **No broad autonomous rewrites.** No scope drift. No speculative
  abstractions. Three similar lines is fine — refactor on the third
  _real_ duplication, not the second hypothetical one.
- **Ask before guessing.** Ambiguity at the start is cheap; ambiguity
  after a thousand lines is not. See `HANDOFF.md` §9 for the canonical list
  of known-ambiguities and their resolutions.

## Source-of-truth precedence

When the spec and the prototype disagree, **the prototype wins on visuals**
and **`HANDOFF.md` wins on rules and scope**. The prototype lives in
`_handoff/content-planner/project/` (gitignored — keep it on disk locally).

## Decisions already locked

These are settled — don't relitigate them unless the user reopens the
question.

| Decision         | Value                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Stack            | Next.js 15 (App Router) + TS + Tailwind v4 + Supabase                                           |
| Fonts            | Geist / Geist Mono via `next/font` (not Google Fonts URL)                                       |
| Theme            | `auto` default; persisted to `localStorage` with try/catch fallback                             |
| Density          | `comfy` default                                                                                 |
| Dark mode        | Class `dark` on `<html>` ONLY (root carries `pp2` always). See "Theme selector strategy" below. |
| Pace KPI         | Rolling 7-day window                                                                            |
| v1 notifications | Overdue + token-expired only                                                                    |
| Local dev DB     | Supabase CLI + Docker; remote staging at M2c                                                    |
| Soft delete      | 30-day window; hard-delete via CRON later                                                       |
| PWA manifest     | M0 groundwork; service worker scaffolding deferred                                              |
| v1 OAuth         | Stubbed (record handle, set status=connected)                                                   |

Anything not in this table or `HANDOFF.md` is open and worth asking about.

## Repo layout

```
.
├─ CLAUDE.md           # you are here
├─ HANDOFF.md          # product + design source of truth
├─ roadmap.md          # milestones, status, what's next
├─ README.md           # quickstart for humans
├─ next.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json       # strict mode + path alias @/* → src/*
├─ package.json
├─ .env.example
├─ src/
│  ├─ app/             # App Router; (app) shell + (marketing) signed-out
│  │  ├─ layout.tsx    # html.pp2, next/font wiring, no-flash theme script
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ ui/           # Button, IconButton, Chip*, AppBar, BottomNav, Sheet, Snackbar, KPI, Skeleton, Surface, Segmented, EmptyState
│  │  ├─ post/         # PostRow, BoardCard, StatusPopover
│  │  ├─ sheets/       # QuickCaptureSheet, ScheduleSheet, FilterSheet
│  │  └─ providers/    # ThemeProvider, QueryProvider, ToastProvider
│  ├─ lib/
│  │  ├─ supabase/     # server/client/middleware clients (M2+)
│  │  ├─ db/           # typed query/mutation helpers per entity (M2+)
│  │  ├─ time.ts       # tz-aware today/week math
│  │  └─ rrule.ts      # repeat rule helpers
│  ├─ hooks/
│  ├─ types/           # generated Supabase types + domain enums
│  ├─ styles/
│  │  ├─ tokens.css    # PORTED VERBATIM — do not rename variables
│  │  └─ globals.css
│  └─ mocks/           # fixtures used by M1 screens and Playwright tests
├─ supabase/           # migrations, policies, seed (M2+)
└─ _handoff/           # design bundle (gitignored)
```

## Theme selector strategy (single source)

There is exactly **one** place where the theme is reflected in the DOM:
the `<html>` element. It always carries `class="pp2"` (set in
`layout.tsx`); the `dark` class is added or removed on the same element by
the no-flash boot script and by `ThemeProvider`. Never apply `dark` to
`<body>`, route wrappers, or feature roots — selectors will desync and
half the UI will paint the wrong palette.

The storage key and media query live in **one** module
(`src/lib/theme/constants.ts`) imported by both the boot script and
`ThemeProvider`, so resolution logic can never drift.

Aligned consumers:

| Surface               | Selector / source                                                         |
| --------------------- | ------------------------------------------------------------------------- |
| `tokens.css`          | `.pp2` (light), `.pp2.dark` (dark)                                        |
| Tailwind dark variant | `@custom-variant dark (&:where(.pp2.dark, .pp2.dark *))` in `globals.css` |
| No-flash boot script  | adds `dark` to `document.documentElement`                                 |
| `ThemeProvider`       | adds/removes `dark` on `document.documentElement`                         |

If you need to read the theme at runtime, use `useTheme()` — never sniff
`document.documentElement.classList` directly.

## Hard rules

1. **Tokens are law.** Every color/spacing/radius/shadow value comes from
   `src/styles/tokens.css`. No raw hex in components. No new tokens without
   updating the handoff cross-reference.
2. **A11y is not optional.** WCAG 2.2 AA minimum. Focus-visible everywhere,
   44×44 hit targets (use `.pp2-hit`), `prefers-reduced-motion` honored,
   semantic ARIA on tabs/segmented/filter chips/bottom-nav per handoff §5.
3. **TypeScript strict.** `strict: true`, `noUncheckedIndexedAccess: true`.
   Type errors fail CI.
4. **Server state via TanStack Query** with optimistic mutations. **Forms via
   React Hook Form + Zod.** **Ephemeral UI state local**, or Zustand only
   when it must cross route boundaries.
5. **Snackbar + UNDO** for every destructive-feeling mutation (status change,
   soft delete, reschedule). No confirm dialogs for those.
6. **Schema + RLS before any data feature.** Do not write a Supabase read
   path until M2a's migration and policy tests are green.
7. **Defensive storage access.** Always wrap `localStorage` /
   `sessionStorage` / `matchMedia` reads in try/catch with a sensible
   fallback. They can throw in privacy modes and SSR contexts.
8. **Times are TZ-aware.** Store as `timestamptz`. Compute "today" and "this
   week" in the user's TZ (`users.tz`) on the client.

## Soft rules

- Comments: write none by default. Only document **why**, never **what**.
- Don't reference the current task or ticket inside source comments.
- Tests follow code; don't write speculative test scaffolding ahead of the
  feature.
- Prefer editing existing files to creating new ones.

## When in doubt

Ask. The user prefers clarifying questions over rework.
