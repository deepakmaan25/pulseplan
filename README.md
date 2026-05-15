# PulsePlan

A premium content planner for solo multi-platform creators. Single-user
workspaces in v1; capture → draft → review → scheduled → published across
Instagram, LinkedIn, X, YouTube, and Threads.

> **Source of truth.** Three documents at the repo root drive every
> implementation decision:
>
> - [`HANDOFF.md`](./HANDOFF.md) — the approved product + design handoff.
>   Visual and interaction rules are non-negotiable.
> - [`roadmap.md`](./roadmap.md) — milestone breakdown and current status.
> - [`CLAUDE.md`](./CLAUDE.md) — orientation for AI coding agents
>   (and humans).
>
> Read them in that order before touching code.

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + design tokens ported from the handoff
- **Geist** / **Geist Mono** via `next/font`
- **Supabase** (Postgres / Auth / Storage / Realtime) — wired in M2
- Local dev: **Supabase CLI + Docker**; remote staging at M2c
- Deploy: **Vercel** at M4

## Prerequisites

- Node.js ≥ 20.11
- A package manager: `npm`, `pnpm`, or `yarn`
- (M2+) Docker Desktop and the Supabase CLI

## Local development

```bash
# install dependencies
npm install

# run the dev server
npm run dev
# → http://localhost:3000

# typecheck
npm run typecheck

# lint
npm run lint
```

The Supabase environment variables in `.env.example` are intentionally blank
until M2a. The app boots without them; data features come online milestone by
milestone.

## Project layout

See [`CLAUDE.md`](./CLAUDE.md#repo-layout) for the canonical map. Short
version:

```
src/app/         App Router routes
src/components/  UI primitives and feature components
src/lib/         Supabase clients, time/tz, helpers
src/styles/      tokens.css (ported) + globals.css
supabase/        migrations, policies, seed (M2+)
_handoff/        Local-only design bundle (gitignored)
```

## Status

Milestone 0 — repo foundation and source-of-truth docs are in. The component
library, theme provider, and CI follow in the next M0 steps. See
[`roadmap.md`](./roadmap.md) for what's done and what's next.
