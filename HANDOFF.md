# PulsePlan — Implementation Handoff

> **This file is a curated local copy** of the approved handoff that arrived
> in the design bundle (`_handoff/content-planner/project/CONTENT_PLANNER_HANDOFF.md`).
> It is the single source of truth for product scope, visual rules, data
> model, and milestone exit criteria. **Do not redesign.** When something is
> ambiguous, prefer the visuals shown in
> `_handoff/content-planner/project/PulsePlan v2.html` and the rules in this
> document over invention.
>
> A short **Decisions log** at the bottom records the resolutions to the
> handoff's open questions (§9) so they don't have to be re-asked.

---

## 1. Product summary

### What PulsePlan is

A premium content planner for solo creators. It moves an idea through four stages — **capture → draft → schedule → ship** — across multiple platforms (Instagram, LinkedIn, X, YouTube, Threads), with first-class support for status, priority, and content pillars.

### Who it is for

A solo multi-platform creator (the design persona is "Maya" — essays + studio podcast + IG/Threads + occasional YT video). Single-user workspaces in v1; the data model is designed to extend to small teams later without a redraw.

### Core user goals

1. **Never lose an idea.** Capture in two taps from any screen.
2. **Know what's next.** Today and the week are answered without thinking.
3. **Move work forward.** A clear path from idea → drafting → review → scheduled → published.
4. **See what worked.** Lightweight analytics show recent reach + engagement.

### Primary product loop

```
Inbox (capture) → Draft (edit) → Review (self-check) → Scheduled (planner)
       ↑                                                       ↓
   Reschedule ←── Overdue (auto-flag) ←── Published (analytics)
```

---

## 2. Approved scope for v1

### Must include

- **Auth**: email + magic link (Supabase Auth). One workspace per user.
- **Onboarding**: 4 steps — welcome, platforms connect, pillars (3–5), cadence target.
- **Content item CRUD**: title, caption, hooks (array, choose one), pillar, platform, type, status, priority, scheduled_at, reminder offset, repeat rule, attachments.
- **Five core surfaces**: Today, Weekly Plan, Monthly Calendar, Board (by status), Content Detail.
- **Quick Capture sheet** from any tab.
- **Schedule sheet** from detail or planner.
- **Analytics snapshot** (last 28 days; manually entered or pulled metrics — see §9).
- **Notifications** (in-app list; push deferred — §9).
- **Settings / profile**: pillars, cadence, theme (light/dark/auto), density.
- **Light + dark mode**.

### Intentionally excluded from v1

- Multi-user workspaces, comments, assignment, mentions.
- Real auto-publishing to platforms (we store and remind; we do **not** post on behalf of the user yet).
- AI hook/caption generation as a real model call. Show the UI; stub it with predefined alternates for v1.
- Long-form content (newsletter body editor). Caption editor only.
- Drag-and-drop on the Board between columns; tap a card → change status in detail. (Defer DnD to v1.1.)
- Mobile native apps. PWA-ready web only.
- Per-platform preview rendering (IG grid mock-up, LI preview). Defer.

---

## 3. Information architecture

### Main navigation (bottom tab bar)

Five slots, **left to right**:

1. **Today** (home) — overdue callout, KPI strip, today's items, up next, needs your eyes, just shipped
2. **Plan** — defaults to Weekly; segmented control switches to Monthly
3. **+ New** — primary FAB → opens Quick Capture sheet
4. **Board** — kanban-style columns by status
5. **Stats** — analytics snapshot

The center FAB is identical on every tab — same action everywhere.

### Screen list (primary)

| #   | Screen           | Route              | Primary |
| --- | ---------------- | ------------------ | ------- |
| 1   | Onboarding       | `/onboarding`      | ✓       |
| 2   | Today            | `/`                | ✓       |
| 3   | Weekly Plan      | `/plan`            | ✓       |
| 4   | Monthly Calendar | `/plan?view=month` | ✓       |
| 5   | Board            | `/board`           | ✓       |
| 6   | Content Detail   | `/posts/[id]`      | ✓       |
| 7   | Analytics        | `/stats`           | ✓       |
| 8   | Notifications    | `/notifications`   | —       |
| 9   | Settings         | `/settings`        | —       |

### Sheets and overlays (not screens)

- **Quick Capture sheet** — overlay anywhere via FAB.
- **Schedule sheet** — overlay over Content Detail.
- **Status popover** — over the status chip in Content Detail.
- **Filter sheet** — over Board and Plan headers.

### Screen connections

- Tapping any post card → **Content Detail** push.
- Detail → Schedule sheet → confirm → snackbar → back to caller.
- Today's "Just shipped" card → **Stats** with that post highlighted.
- Overdue callout → Schedule sheet pre-filled with overdue post.

---

## 4. Core user flows

### 4.1 Onboarding

1. **Welcome** — name + handle.
2. **Platforms** — connect at least one (OAuth stubs in v1; we just record account handle + display token-status pill).
3. **Pillars** — pick 3–5 from a default list, or add custom. Each gets a color from a palette of 5.
4. **Cadence** — target posts/week (slider, 1–14, default 3).

Persist after every step. "Skip" allowed on platforms and pillars; required on welcome.

### 4.2 Quick Capture (from any tab)

1. FAB tap → bottom sheet rises.
2. Title input is auto-focused; keyboard opens.
3. Inline pickers: Pillar / Platform / Priority / When (defaults to "inbox", i.e. unscheduled).
4. Save → snackbar "Saved to {pillar}" with UNDO → sheet dismisses → return to caller.
5. ESC / scrim tap dismisses with confirm if title has content.

### 4.3 Create / edit content item

- Identical screen for both — Content Detail with `?new=1` for create.
- Tabs in detail: **Editor** (hooks + caption + hashtags) / **Schedule** / **Checklist** / **Activity** (history).
- Save is implicit on field blur (autosave); explicit "Save" button confirms and shows a toast.
- Delete via overflow menu → confirm dialog ("Move to trash" — soft delete, 30 days).

### 4.4 Weekly planning

- Vertical day rows (Mon–Sun). Each row sticks its label on scroll.
- Top: sticky week strip (7 day cells, each tappable to scroll to that day's row).
- Top of scroll area: **Overdue** callout (if any) + **Unscheduled tray** (horizontal-scroll cards from inbox/drafts).
- Empty days show a dashed "Schedule for {day}" CTA inline.
- Tap a card → Detail. Long-press a card → reschedule mode (defer DnD to v1.1, see §9; for v1 long-press opens Schedule sheet).

### 4.5 Board workflow

- Five columns: Idea → Drafting → Review → Scheduled → Published.
- Counts per column.
- Filter strip on top: pillar, platform(s), priority, week.
- Tap a card → Detail. **Do not** ship drag-and-drop in v1 — change status via the chip on Detail. (See §9 for v1.1 plan.)

### 4.6 Rescheduling

Three entry points:

- Overdue callout → Schedule sheet pre-filled with overdue item.
- Detail → Schedule tab or sticky "Schedule" button.
- Planner long-press → Schedule sheet (v1) / drag (v1.1).

Schedule sheet anatomy:

- Suggested slot card at top ("matches your weekly slot" — based on existing recurring slots).
- Day picker (7-day grid, current week).
- Time slot grid (8 quick chips: 06:00, 07:00, 09:00, 12:00, 15:00, 17:00, 18:00, Custom).
- Repeat + reminder rows.
- Confirm → snackbar with UNDO.

### 4.7 Status changes

- Tap status chip on Detail → popover with 5 options.
- Selecting a new status:
  - Animates the chip color in place.
  - Logs an Activity entry.
  - Shows snackbar with UNDO (3s).
- No confirmation dialog. Undo is the safety net.

### 4.8 Settings / profile

- Profile (name, handle, avatar — monogram block, no upload in v1).
- Plan (cadence, pillars, recurring slots — view-only list with edit deep links).
- Integrations (per-platform: connected / re-auth / disconnect).
- Appearance (theme + density).
- Account (notifications, export data, help, sign out).

---

## 5. Design system implementation notes

The reference token sheet has been **ported verbatim** to
`src/styles/tokens.css`. Token names are preserved exactly so design files
and code stay aligned. The scoping classes (`.pp2`, `.pp2.dark`) are also
preserved; the `<html>` element carries `class="pp2"` always, and the
`dark` class is toggled by the theme provider.

### Token categories

- **Surfaces**: `--bg-base`, `--bg-sunken`, `--surface-1` … `--surface-4`, `--scrim`
- **Ink**: `--ink-1` … `--ink-4`, `--ink-disabled`, `--ink-inverse`
- **Lines**: `--divider`, `--divider-strong`, `--outline`, `--outline-strong`, `--outline-focus`
- **Accent**: `--primary`, `--primary-hover`, `--primary-press`, `--primary-soft`, `--primary-ink`
- **Semantic**: `--success`, `--warning`, `--error`, `--info` (each + `-soft` + `-ink`)
- **Status** (per workflow state): `--st-idea-*` … `--st-overdue-*`
- **Priority**: `--pri-P0`, `--pri-P1`, `--pri-P2`
- **Platform** (per platform): `--plat-{ig|li|x|yt|th}` + `-soft`
- **Type**: `--font-sans`, `--font-mono`, type role variables
- **Spacing**: 4pt scale (`--s-1` … `--s-16`)
- **Radius**: `--r-xs` … `--r-2xl`, `--r-full`
- **Elevation**: `--e-0` … `--e-4`, `--e-sheet`
- **Motion**: `--easing-standard`, `-emphasized`, `-decelerate`, `-accelerate`, `--dur-fast`, `-standard`, `-slow`

### Light / dark behavior

- Theme is a class on `<html>`: `.pp2` is the root scope; add `.dark` for dark mode.
- In dark mode, **surfaces tier up** in lightness (#15181C → #2D333C) rather than using shadows for elevation.
- Status / semantic chips use a soft tinted bg + ink-fg pairing that has **different hex values in each mode** — never invert.
- "Auto" theme follows `prefers-color-scheme`.
- Fonts are loaded via `next/font` (`Geist`, `Geist_Mono`). Never import them from a CDN URL.

### Typography roles

Single typeface family for sans (Geist). Mono for IDs, time stamps, metadata, code-like labels (Geist Mono).

| Role     | Size / line-height | Weight | Letter-spacing | Use              |
| -------- | ------------------ | ------ | -------------- | ---------------- |
| display  | 28 / 1.15          | 700    | -0.025em       | Screen H1        |
| title-lg | 22 / 1.25          | 700    | -0.02em        | Detail H1        |
| title    | 17 / 1.3           | 600    | -0.015em       | Section H        |
| body     | 14 / 1.5           | 450    | -0.005em       | Default text     |
| caption  | 12 / 1.4           | 500    | 0              | Secondary text   |
| label    | 11 / 1.3           | 600    | 0.04em         | UPPERCASE labels |
| mono     | 11 / 1.4           | 500    | 0              | Metadata / IDs   |

Never use a typeface other than Geist + Geist Mono.

### Spacing / radius / elevation rules

- Everything snaps to a **4pt grid**. Half-steps (2px) only inside chips.
- Radii: chips/inputs `--r-sm`, cards `--r-md`, sheets/dialogs `20px 20px 0 0` for bottom sheets and `--r-lg` for centered modals.
- Elevation in **light**: combine border (`--divider`) with shadow (`--e-1` for default cards, `--e-3` for popovers, `--e-4` for modals).
- Elevation in **dark**: combine border + raised surface tier; do **not** add a shadow.

### Component behavior and states

Every interactive must implement:

- **Default**
- **Hover** (web only)
- **Pressed** — `transform: scale(0.97)` via `.pp2-press` for 120ms
- **Focus-visible** — 3px halo using `--outline-focus`
- **Disabled** — opacity 0.5, `pointer-events: none`
- **Loading** (where applicable) — spinner replaces label, `aria-busy="true"`

### Accessibility expectations

- WCAG 2.2 **AA** minimum, AAA where reasonable for body text.
- Touch targets ≥ 44×44 (use `.pp2-hit` helper for visually smaller hit zones).
- All icon-only buttons carry `aria-label`.
- Bottom nav active tab carries `aria-current="page"`.
- Segmented controls use `role="tablist"` / `aria-selected`.
- Filter chips use `aria-pressed`.
- `prefers-reduced-motion: reduce` collapses animation durations to 1ms.
- Never signal state with color alone — always pair with text, icon, or shape.
- Text contrast: ink-1 ≥ 13:1, ink-2 ≥ 7:1, ink-3 ≥ 5:1 against `--bg-base`.

---

## 6. Component inventory

Every component lives in `src/components/ui/`. Visual rules come from
`_handoff/content-planner/project/pp2-components.jsx` — reimplement them in
React + Tailwind v4, not by copying the prototype's structure.

### Button

- **Purpose**: Primary action trigger.
- **Anatomy**: Optional leading icon · Label · Optional trailing icon.
- **Variants**: `filled` (primary action) / `tonal` (secondary) / `outlined` (safe alt) / `text` (low attention). All four support `danger` flag.
- **Sizes**: `sm` (32h), `md` (44h, default), `lg` (52h).
- **States**: default, hover, pressed, focus, disabled, loading.
- **Used in**: Every screen with an action. Sheet footers always have a filled primary + outlined cancel.
- **Implementation**: Height enforces minimum touch target. Loading swaps label for a spinner; preserve `min-width` to prevent layout shift.

### IconButton

- **Purpose**: Icon-only affordance for app-bar actions, sheet close, list-row controls.
- **Anatomy**: Single icon (16–22px depending on container size).
- **Variants**: `ghost` (transparent), `filled` (surface + border), `tonal` (primary-soft), `primary` (solid).
- **Sizes**: 36, 40 (default), 44, 48. Anything < 44 must include `.pp2-hit` for hit-area expansion.
- **States**: same as Button + `selected` (for toggleable icon buttons).
- **`badge`** prop: count or boolean dot in top-right.

### StatusChip

- **Purpose**: Show workflow state. Five canonical states: Idea / Drafting / Review / Scheduled / Published. Sixth: Overdue (derived).
- **Anatomy**: 6px dot + label.
- **Variants**: `sm` (20h) / `md` (22h, default).
- **Pair**: `fg` + tinted `bg`. Never the same hex across statuses.
- **Used in**: Post cards (sm), Board column header (with count), Detail header (md), filter chips.

### PillarChip

- **Purpose**: Show content theme.
- **Anatomy**: 6px square dot + name.
- **Color**: from pillar record (`Pillar.color`).
- **Variants**: `sm`/`md`, `withDot` toggle.

### PlatformChip

- **Purpose**: Show target platform.
- **Anatomy**: Platform glyph (abstracted, not real logo) + optional name.
- **Variants**: glyph only / glyph + label / mono dark (Settings).
- **Color**: from `Platform.color`. Soft bg from `Platform.softColor`.

### PriorityChip

- **Purpose**: Show importance (P0/P1/P2).
- **Anatomy**: Outlined letterform tag (no fill, colored border + ink).
- **Color**: red / amber / gray.

### FilterChip

- **Purpose**: Toggle filter state.
- **States**: inactive (surface bg + outline) / active (inverted ink-1 bg).
- **`aria-pressed`** required.

### AppBar

- **Purpose**: Screen top chrome.
- **Anatomy**: Optional leading icon button · Title (+ optional subtitle) · Trailing actions.
- **Variants**: `compact` (44h, single line) for nested screens / `prominent` (66h, kicker + title) for root tabs.
- **Implementation**: Top safe-area padding = 52px (matches mobile status bar inset).

### BottomNav

- **Purpose**: Primary navigation.
- **Slots**: Today, Plan, **+ FAB**, Board, Stats.
- **Active state**: ink-1 icon + label; inactive ink-3.
- **FAB**: never a tab — it always opens Quick Capture, regardless of active tab.

### Segmented

- **Purpose**: Inline view switch (2–3 options).
- **Used in**: Plan (Week/Month), Stats (7d/28d/90d), Settings (Theme, Density).
- **Implementation**: `role="tablist"`, each option `role="tab"` with `aria-selected`.

### Surface (Card)

- **Purpose**: Generic elevated container.
- **Variants**: levels 1–4 (e1 default, e2 raised, e3 popover, e4 modal).
- **`onClick`**: switches to button semantics + `.pp2-press`.

### PostRow / DayCard

- **Purpose**: Display a content item in a list.
- **Anatomy**: Status bar (3px colored stripe) · Time column (with reminder hint) · Divider · Chips row (platform + type + priority) · Title · Status + pillar chips · Trailing chevron.
- **Min-height**: 64.
- **Used in**: Today, Weekly Plan day rows, search results.

### BoardCard

- **Purpose**: Compact card for Board column.
- **Anatomy**: Pillar chip + priority · Title (2-line clamp) · Platform + type · Day stamp.
- **No status chip** — column itself communicates status.

### Sheet (Bottom)

- **Purpose**: Modal content from below for capture, schedule, filter.
- **Anatomy**: Drag handle · Header (kicker + title + close X) · Body · Footer with primary action.
- **Background**: `--surface-4`. Scrim at 0.48 light / 0.68 dark.
- **Motion**: enter on `--easing-emphasized` 320ms; exit 200ms.

### Snackbar

- **Purpose**: Confirm a reversible action.
- **Anatomy**: Status icon · message · UNDO button.
- **Position**: 92px from bottom (above bottom nav).
- **Lifetime**: 2.4s. Only one at a time.

### EmptyState

- **Purpose**: Communicate "nothing here yet" with an action.
- **Anatomy**: Dashed icon square · Title · 1-line description · Primary + secondary action.

### KPI card

- **Purpose**: A single metric.
- **Anatomy**: Mono label (caps) · tabular-num figure · delta with arrow + semantic color.

### Skeleton

- **Purpose**: Loading placeholder.
- **Implementation**: `.pp2-skel` class. Shimmer animation respects `prefers-reduced-motion`.

---

## 7. Screen-by-screen build notes

### 7.1 Onboarding (`/onboarding`)

- **Purpose**: Collect minimum config to make the rest of the app non-empty.
- **Content**: 4 steps in a stepper (top progress bar).
- **Actions**: Back / Continue at footer. Skip optional from step 2 onward.
- **Edge cases**: User exits mid-flow → resume from last completed step.
- **Empty/Loading/Error**: N/A (no data fetched).
- **Behavior**: Each step persists on Continue. Pillar colors are auto-assigned from a 5-color palette but reorderable.

### 7.2 Today (`/`)

- **Purpose**: One-glance answer to "what should I do now?"
- **Content**, in order:
  1. App bar: "Today" + day/date subtitle, search + bell icons (bell badged with notification count).
  2. Overdue callout (conditional).
  3. KPI strip (today / week / drafts / pace).
  4. **Today** section — items where `scheduled_at` is today.
  5. **Up next** — next 2 scheduled items not today.
  6. **Needs your eyes** — items in Drafting or Review.
  7. **Just shipped** — most recent Published item with reach/eng.
- **Priority actions**: tap a card (→ Detail), FAB (→ Capture), bell (→ Notifications).
- **Edge cases**: All sections empty → consolidated empty state with "Capture your first idea" CTA.
- **Empty/Loading/Error**: Each section gets its own skeleton + an overall error toast.

### 7.3 Weekly Plan (`/plan`)

- **Purpose**: Plan the next 7 days at a glance.
- **Content**: Sticky week strip · Overdue callout · Unscheduled tray · Day rows (Mon–Sun).
- **Priority actions**: tap day in strip (scrolls to row), tap card (→ Detail), tap empty day CTA (→ Capture pre-filled with `scheduled_at` set to that day, default 09:00).
- **Edge cases**: Week with zero items → unscheduled tray shows + every day row collapsed to dashed CTA.
- **Empty/Loading/Error**: Skeleton matches structure (day strip + 3 sample rows).
- **Behavior**: Sticky day headers as you scroll. Right-edge fade on unscheduled tray. Long-press on a card opens Schedule sheet pre-filled (v1).

### 7.4 Monthly Calendar (`/plan?view=month`)

- **Purpose**: Monthly density view.
- **Content**: Day labels row · 5–6 week grid · footer with current day summary.
- **Cells**: number top-right, 3-pip color bar at bottom (one per item, color = status).
- **Edge cases**: Empty months show pips-as-dashes.
- **Behavior**: Tap a day → push to Week view scrolled to that day (or open day sheet — v1 picks "scroll Week" for simplicity).

### 7.5 Board (`/board`)

- **Purpose**: Workflow Kanban.
- **Content**: Filter strip · 5 horizontal-scrolling columns (Idea, Drafting, Review, Scheduled, Published) · cards in each.
- **Priority actions**: tap card (→ Detail), tap column "+" (→ Capture pre-filled with status = column).
- **Edge cases**: empty column → dashed "Add" CTA row.
- **Defer**: drag-and-drop between columns (v1.1).

### 7.6 Content Detail (`/posts/[id]`)

- **Purpose**: The single edit surface.
- **Content**:
  - Top: status row (chip + priority + pillar + platform) and title (editable inline).
  - Tabs: **Editor / Schedule / Checklist / Activity**.
  - Editor: hook variants (3, pick one) + caption editor + hashtag chips.
  - Schedule: day + time + repeat + reminder.
  - Checklist: per-platform required items.
  - Activity: change log.
- **Priority actions**: Schedule (primary, sticky bottom), Save (secondary, autosaves anyway), Delete (overflow).
- **Edge cases**: New post (`?new=1`) → title field auto-focused. Deleted post → 404 with "Restore from trash" link.

### 7.7 Analytics (`/stats`)

- **Purpose**: Lightweight performance snapshot.
- **Content**: Range picker (7/28/90d) · hero reach card with sparkline · 4 KPI cards (engagement, followers, saved, avg watch) · platform breakdown · top posts list.
- **Edge cases**: < 4 published posts → "Not enough data yet" state.
- **Data**: Numbers are user-entered in v1 (see §8) unless a platform integration is wired up.

### 7.8 Notifications (`/notifications`)

- **Purpose**: System messages and reminders.
- **Content**: Grouped by Today / This week / Earlier.
- **Row anatomy**: icon (tone-colored) + title + meta + (optional inline CTA).
- **Behavior**: Mark all read in app bar overflow. Tapping a row routes to the relevant context (post, settings).

### 7.9 Settings (`/settings`)

- **Purpose**: Configure account, integrations, appearance.
- **Sections**: Profile / Plan / Integrations / Appearance / Account.
- **Edge cases**: Integration with expired token → "Re-auth" pill + tap → OAuth flow.

---

## 8. Data model assumptions

Postgres schemas, normalized for Supabase. Foreign keys are UUIDs. All tables include `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`.

### `users` (managed by Supabase Auth, extended)

```
id uuid (auth.users.id)
display_name text
handle text unique
avatar_initials text  -- "MC"
cadence_target smallint default 3  -- posts per week
theme text default 'auto'  -- 'light' | 'dark' | 'auto'
density text default 'comfy'  -- 'comfy' | 'compact'
tz text default 'UTC'  -- IANA timezone; drives Today/This week math
onboarded_at timestamptz
```

### `pillars`

```
id uuid
user_id uuid → users
name text
color text  -- hex or token key
order_index smallint
archived boolean default false
```

Constraints: unique `(user_id, name)`.

### `platforms` (per-user connection, not global)

```
id uuid
user_id uuid → users
platform text  -- enum: 'ig' | 'li' | 'x' | 'yt' | 'th'
handle text
access_token text  -- nullable; v1 stubs
status text  -- 'connected' | 'expired' | 'disconnected'
last_sync_at timestamptz
```

### `posts` (the central entity)

```
id uuid
user_id uuid → users
title text
caption text
hooks jsonb  -- array of { id, text, selected }
pillar_id uuid → pillars
platform text  -- enum, matches platforms.platform
post_type text  -- 'reel' | 'carousel' | 'story' | 'static' | 'thread' | 'video'
status text  -- 'idea' | 'draft' | 'review' | 'sched' | 'pub'
priority text  -- 'P0' | 'P1' | 'P2'
scheduled_at timestamptz  -- nullable when status = idea/draft
reminder_minutes smallint  -- default 30
repeat_rule text  -- iCalendar RRULE string, nullable
published_at timestamptz  -- set when status = pub
deleted_at timestamptz  -- soft delete (30-day window)
```

**Derived field** (do not store): `overdue = (status = 'sched' AND scheduled_at < now())`.

### `post_checklist_items`

```
id uuid
post_id uuid → posts
label text
done boolean default false
order_index smallint
```

### `post_activity` (audit log)

```
id uuid
post_id uuid → posts
actor_id uuid → users
event text  -- 'created' | 'status_changed' | 'scheduled' | 'rescheduled' | 'published' | 'updated_caption' | 'hook_selected'
from_value text
to_value text
created_at timestamptz default now()
```

### `post_metrics` (1:1 with `posts` after publish)

```
post_id uuid → posts (primary key)
reach int
engagement_pct numeric(5,2)
followers_gained int
saved int
avg_watch_seconds int
fetched_at timestamptz
```

### `attachments`

```
id uuid
post_id uuid → posts
storage_path text  -- supabase storage key
kind text  -- 'image' | 'video' | 'audio' | 'file'
size_bytes bigint
```

### `notifications`

```
id uuid
user_id uuid → users
tone text  -- 'primary' | 'review' | 'success' | 'error' | 'default'
icon text
title text
meta text
deep_link text  -- /posts/[id] or /settings
read_at timestamptz
```

### RLS (row-level security)

- Every table: `policy "owner" using (auth.uid() = user_id)`.
- For child tables (`post_*`, `attachments`), join via the parent's `user_id`.

---

## 9. Engineering notes

### What can be static UI first (Milestone 1)

- Every screen in `pp2-*.jsx` — rebuild as Next.js pages/components using **mock data** identical to `POSTS2`, `PILLARS2`, `PLATFORMS2`.
- Component library (`src/components/ui/*`).
- Theme switching (light/dark/auto).
- Quick Capture + Schedule sheets (state-only, no persistence).
- All visual states (empty / loading / error / overdue / published).

### What requires backend (Milestone 2+)

- Supabase Auth (magic link).
- Posts CRUD with optimistic UI.
- Pillars CRUD.
- Platforms connect (start with mock OAuth — stores `handle` + sets `status=connected`).
- Notifications list (read from `notifications` table; no push yet).

### What is deferred

| Feature                        | When | Why                                                                            |
| ------------------------------ | ---- | ------------------------------------------------------------------------------ |
| Real auto-publishing           | v2   | Each platform has different API rules and review; significant compliance work. |
| AI hook/caption generation     | v1.1 | Stub UI now with pre-defined alternates. Wire OpenAI/Anthropic later.          |
| Drag-and-drop on Board         | v1.1 | The status-chip-in-detail flow covers the same job; DnD is touch-finicky.      |
| Push notifications             | v1.1 | Web push needs PWA + service worker + permissions UX.                          |
| Team workspaces                | v2   | Data model already supports it; UI doesn't.                                    |
| Real platform analytics ingest | v1.1 | Start with user-entered metrics fields on the Published-state post detail.     |
| Recurring slot manager UI      | v1.1 | Store RRULE; UI for editing is its own feature.                                |
| Multi-attachment upload        | v1.1 | Schema supports; UI shows single-file in v1.                                   |

### Performance / quality bars

- Lighthouse Performance ≥ 90 on mobile.
- Lighthouse Accessibility = 100.
- Initial JS ≤ 130KB gzipped on first paint.
- All routes prerendered or ISR where possible; Detail is dynamic.

---

## 10. Decisions log

Resolutions to the open questions in §9 of the original handoff. **These are
locked.** Re-open only with explicit user instruction.

| #   | Question                   | Decision                                                                                                                                              |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | OAuth scopes per platform  | v1 ships stubbed OAuth (record handle, set `status=connected`). Real OAuth is v1.1.                                                                   |
| 2   | Time zones                 | Store `users.tz` (IANA). Compute Today / This week on the client in user TZ. `scheduled_at` remains `timestamptz`.                                    |
| 3   | Analytics data source      | v1 = user-entered. Real ingestion is v1.1.                                                                                                            |
| 4   | Soft-delete window         | 30 days. Hard-delete via scheduled CRON later.                                                                                                        |
| 5   | Cadence pace KPI           | **Rolling 7-day window.** Not calendar week.                                                                                                          |
| 6   | Notification triggers (v1) | **Overdue** and **token-expired** only. Reach-threshold and pre-publish triggers are v1.1.                                                            |
| 7   | PWA                        | Manifest scaffolding lands in M0. Service worker is M4.                                                                                               |
| 8   | Theme default              | `auto`. Persisted to `localStorage`; reads wrapped in try/catch (privacy modes can throw).                                                            |
| 9   | Density default            | `comfy`.                                                                                                                                              |
| 10  | Fonts                      | Loaded via `next/font` (Geist, Geist_Mono). The handoff's Google Fonts `@import url(...)` line is intentionally omitted from the ported `tokens.css`. |
| 11  | Local dev DB               | Supabase CLI + Docker. Remote staging starts at M2c.                                                                                                  |

---

## Glossary

| Term     | Definition                                                                                    |
| -------- | --------------------------------------------------------------------------------------------- |
| Pillar   | A content theme (e.g. "Essays", "Studio Notes"). User-defined, color-coded.                   |
| Status   | Workflow state. Five: Idea / Drafting / Review / Scheduled / Published. Plus derived Overdue. |
| Priority | P0 (critical) / P1 (high) / P2 (normal).                                                      |
| Hook     | A first-line variant for a post. A post has multiple; one is "selected".                      |
| Cadence  | Target posts per week.                                                                        |
| Today    | Items where `scheduled_at` is today in the user's TZ.                                         |
| Up next  | Next scheduled items that are not today (default: 2).                                         |
| Inbox    | Posts with status = Idea and no `scheduled_at`.                                               |

---

**End of handoff.** When in doubt, defer to the visuals in
`_handoff/content-planner/project/PulsePlan v2.html` and the rules above.
