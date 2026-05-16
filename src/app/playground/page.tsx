"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Calendar,
  Columns3,
  Home,
  Inbox,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useTheme, useToast } from "@/components/providers";
import { THEME_VALUES, type Theme } from "@/lib/theme/constants";
import {
  AppBar,
  BottomNav,
  Button,
  EmptyState,
  FilterChip,
  IconButton,
  KPI,
  PillarChip,
  PlatformChip,
  PriorityChip,
  Segmented,
  Sheet,
  Skeleton,
  StatusChip,
  Surface,
  type Platform,
  type PostStatus,
  type Priority,
} from "@/components/ui";
import { BoardCard, PostRow } from "@/components/post";
import styles from "./playground.module.css";

const PILLARS = [
  { name: "Essays", color: "#2E5BFF" },
  { name: "Studio Notes", color: "#0E9F6E" },
  { name: "Behind the Build", color: "#D97706" },
];

const STATUSES: PostStatus[] = [
  "idea",
  "draft",
  "review",
  "sched",
  "pub",
  "overdue",
];

const PLATFORMS: Platform[] = ["ig", "li", "x", "yt", "th"];

const PRIORITIES: Priority[] = ["P0", "P1", "P2"];

export default function PlaygroundPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();
  const [planView, setPlanView] = useState<"week" | "month">("week");
  const [filterActive, setFilterActive] = useState({
    pillar: false,
    platform: true,
    overdue: false,
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [navTab, setNavTab] = useState("today");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Playground · M1a</p>
        <h1 className={styles.h1}>Component library</h1>
        <p className={styles.lede}>
          Every primitive from HANDOFF.md §6, in every variant and state, in
          both themes. Tap the theme tabs to flip the palette — the entire
          gallery should remain a11y-clean.
        </p>
      </header>

      {/* THEME ---------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="theme-h">
        <h2 id="theme-h" className={styles.sectionTitle}>
          Theme
        </h2>
        <p className={styles.sectionMeta}>
          Setting <span className={styles.mono}>{theme}</span> · resolved{" "}
          <span className={styles.mono}>{resolvedTheme}</span>
        </p>
        <Segmented
          ariaLabel="Theme"
          value={theme}
          onChange={(t) => setTheme(t as Theme)}
          options={THEME_VALUES.map((v) => ({ value: v, label: v }))}
        />
      </section>

      {/* BUTTONS -------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="buttons-h">
        <h2 id="buttons-h" className={styles.sectionTitle}>
          Button
        </h2>
        <div className={styles.col}>
          <span className={styles.subhead}>Variants · md</span>
          <div className={styles.row}>
            <Button variant="filled">Filled</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </div>
          <span className={styles.subhead}>Danger</span>
          <div className={styles.row}>
            <Button variant="filled" danger>
              Delete
            </Button>
            <Button variant="tonal" danger>
              Delete
            </Button>
            <Button variant="outlined" danger>
              Delete
            </Button>
            <Button variant="text" danger>
              Delete
            </Button>
          </div>
          <span className={styles.subhead}>Sizes</span>
          <div className={styles.row}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <span className={styles.subhead}>States · md</span>
          <div className={styles.row}>
            <Button leadingIcon={<Plus />}>With icon</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button
              onClick={() =>
                toast({ message: "Saved to Essays", tone: "primary" })
              }
            >
              Trigger toast
            </Button>
          </div>
        </div>
      </section>

      {/* ICON BUTTONS --------------------------------------------- */}
      <section className={styles.section} aria-labelledby="iconbtn-h">
        <h2 id="iconbtn-h" className={styles.sectionTitle}>
          IconButton
        </h2>
        <div className={styles.col}>
          <span className={styles.subhead}>Variants · 40</span>
          <div className={styles.row}>
            <IconButton icon={<Search />} label="Search" variant="ghost" />
            <IconButton icon={<Search />} label="Search" variant="filled" />
            <IconButton icon={<Search />} label="Search" variant="tonal" />
            <IconButton icon={<Plus />} label="New" variant="primary" />
          </div>
          <span className={styles.subhead}>Sizes</span>
          <div className={styles.row}>
            <IconButton icon={<Search />} label="Search" size={36} />
            <IconButton icon={<Search />} label="Search" size={40} />
            <IconButton icon={<Search />} label="Search" size={44} />
            <IconButton icon={<Search />} label="Search" size={48} />
          </div>
          <span className={styles.subhead}>Badge / selected / disabled</span>
          <div className={styles.row}>
            <IconButton icon={<Bell />} label="Notifications" badge={3} />
            <IconButton icon={<Bell />} label="Notifications" badge />
            <IconButton
              icon={<Bell />}
              label="Notifications"
              variant="filled"
              selected
            />
            <IconButton icon={<Bell />} label="Notifications" disabled />
          </div>
        </div>
      </section>

      {/* CHIPS ---------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="chips-h">
        <h2 id="chips-h" className={styles.sectionTitle}>
          Chips
        </h2>
        <span className={styles.subhead}>StatusChip · 6 canonical states</span>
        <div className={styles.row}>
          {STATUSES.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
        <span className={styles.subhead}>
          StatusChip · sm with count (board headers)
        </span>
        <div className={styles.row}>
          {STATUSES.slice(0, 5).map((s, i) => (
            <StatusChip key={s} status={s} size="sm" count={i + 1} />
          ))}
        </div>
        <span className={styles.subhead}>PillarChip</span>
        <div className={styles.row}>
          {PILLARS.map((p) => (
            <PillarChip key={p.name} name={p.name} color={p.color} />
          ))}
        </div>
        <span className={styles.subhead}>PlatformChip</span>
        <div className={styles.row}>
          {PLATFORMS.map((p) => (
            <PlatformChip key={p} platform={p} />
          ))}
        </div>
        <div className={styles.row}>
          {PLATFORMS.map((p) => (
            <PlatformChip key={p} platform={p} size="sm" showLabel={false} />
          ))}
        </div>
        <span className={styles.subhead}>PriorityChip</span>
        <div className={styles.row}>
          {PRIORITIES.map((p) => (
            <PriorityChip key={p} priority={p} />
          ))}
        </div>
        <span className={styles.subhead}>FilterChip · aria-pressed</span>
        <div className={styles.row}>
          <FilterChip
            label="Pillar"
            active={filterActive.pillar}
            onClick={() =>
              setFilterActive((s) => ({ ...s, pillar: !s.pillar }))
            }
          />
          <FilterChip
            label="Instagram"
            active={filterActive.platform}
            onClick={() =>
              setFilterActive((s) => ({ ...s, platform: !s.platform }))
            }
          />
          <FilterChip
            label="Overdue"
            active={filterActive.overdue}
            onClick={() =>
              setFilterActive((s) => ({ ...s, overdue: !s.overdue }))
            }
          />
        </div>
      </section>

      {/* APP BAR -------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="appbar-h">
        <h2 id="appbar-h" className={styles.sectionTitle}>
          AppBar
        </h2>
        <span className={styles.subhead}>Prominent (root tab)</span>
        <AppBar
          variant="prominent"
          kicker="Friday · 16 May"
          title="Today"
          trailing={
            <>
              <IconButton icon={<Search />} label="Search" />
              <IconButton icon={<Bell />} label="Notifications" badge={2} />
            </>
          }
        />
        <span className={styles.subhead}>Compact (nested screen)</span>
        <AppBar
          variant="compact"
          title="Settings"
          leading={
            <IconButton icon={<ArrowLeft />} label="Back" variant="ghost" />
          }
          trailing={
            <IconButton
              icon={<MoreHorizontal />}
              label="More"
              variant="ghost"
            />
          }
        />
      </section>

      {/* SEGMENTED ------------------------------------------------ */}
      <section className={styles.section} aria-labelledby="seg-h">
        <h2 id="seg-h" className={styles.sectionTitle}>
          Segmented
        </h2>
        <span className={styles.subhead}>Plan view</span>
        <Segmented
          ariaLabel="Plan view"
          value={planView}
          onChange={setPlanView}
          options={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
        <span className={styles.subhead}>Stats range · sm</span>
        <Segmented
          ariaLabel="Stats range"
          size="sm"
          value="28d"
          onChange={() => undefined}
          options={[
            { value: "7d", label: "7d" },
            { value: "28d", label: "28d" },
            { value: "90d", label: "90d" },
          ]}
        />
      </section>

      {/* SURFACE -------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="surf-h">
        <h2 id="surf-h" className={styles.sectionTitle}>
          Surface
        </h2>
        <div className={styles.grid4}>
          {[1, 2, 3, 4].map((lvl) => (
            <Surface key={lvl} level={lvl as 1 | 2 | 3 | 4} padded>
              <span
                style={{
                  font: "var(--t-mono)",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--ls-label)",
                }}
              >
                Level {lvl}
              </span>
            </Surface>
          ))}
        </div>
      </section>

      {/* KPI ------------------------------------------------------ */}
      <section className={styles.section} aria-labelledby="kpi-h">
        <h2 id="kpi-h" className={styles.sectionTitle}>
          KPI
        </h2>
        <div className={styles.grid4}>
          <KPI label="Today" value={3} delta="on track" trend="flat" />
          <KPI label="Week" value={5} unit="/7" delta="+2" trend="up" />
          <KPI label="Drafts" value={11} delta="−1" trend="down" />
          <KPI label="Pace" value="102" unit="%" delta="+5" trend="up" />
        </div>
      </section>

      {/* POST ROW / BOARD CARD ------------------------------------ */}
      <section className={styles.section} aria-labelledby="cards-h">
        <h2 id="cards-h" className={styles.sectionTitle}>
          PostRow &amp; BoardCard
        </h2>
        <span className={styles.subhead}>PostRow</span>
        <div className={styles.col}>
          <PostRow
            time="09:00"
            reminderHint="30m"
            status="sched"
            title="Why I quit publishing on schedule — a year-long experiment"
            pillar={PILLARS[0]!}
            platform="li"
            postType="essay"
            priority="P1"
          />
          <PostRow
            time="—"
            status="draft"
            title="Studio notes: rebuilding the intro segment"
            pillar={PILLARS[1]!}
            platform="ig"
            postType="reel"
          />
          <PostRow
            time="08:00"
            reminderHint="overdue"
            status="overdue"
            title="Behind the build: pricing changes for Q3"
            pillar={PILLARS[2]!}
            platform="x"
            postType="thread"
            priority="P0"
          />
        </div>
        <span className={styles.subhead}>BoardCard</span>
        <div className={styles.grid2}>
          <BoardCard
            title="Why I quit publishing on schedule"
            pillar={PILLARS[0]!}
            platform="li"
            status="draft"
            postType="essay"
            priority="P1"
            dayStamp="Fri · 09:00"
          />
          <BoardCard
            title="Studio notes: rebuilding the intro segment"
            pillar={PILLARS[1]!}
            platform="ig"
            status="idea"
            postType="reel"
            dayStamp="Inbox"
          />
        </div>
      </section>

      {/* SHEET ---------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="sheet-h">
        <h2 id="sheet-h" className={styles.sectionTitle}>
          Sheet
        </h2>
        <p className={styles.sectionMeta}>
          Portal · scrim · ESC closes · click-outside closes · focus moves
          inside on open and restores on close.
        </p>
        <div className={styles.row}>
          <Button variant="filled" onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </div>
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          kicker="Quick Capture"
          title="New idea"
          footer={
            <>
              <Button variant="outlined" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="filled"
                onClick={() => {
                  setSheetOpen(false);
                  toast({
                    message: "Saved to Essays",
                    tone: "primary",
                    actionLabel: "UNDO",
                    onAction: () =>
                      toast({ message: "Reverted", tone: "default" }),
                  });
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <p
            style={{ font: "var(--t-body)", color: "var(--ink-2)", margin: 0 }}
          >
            This is a Sheet shell. In M1b it gets the real Quick Capture form
            (title input, pillar / platform / priority pickers, when-to-schedule
            row).
          </p>
        </Sheet>
      </section>

      {/* SNACKBAR ------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="snack-h">
        <h2 id="snack-h" className={styles.sectionTitle}>
          Snackbar
        </h2>
        <div className={styles.row}>
          <Button
            variant="tonal"
            onClick={() => toast({ message: "Saved to Essays" })}
          >
            Plain
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              toast({
                message: "Moved to Scheduled",
                tone: "primary",
                actionLabel: "UNDO",
                onAction: () => toast({ message: "Reverted", tone: "default" }),
              })
            }
          >
            With UNDO
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              toast({ message: "Couldn't reach server", tone: "error" })
            }
          >
            Error tone
          </Button>
        </div>
      </section>

      {/* EMPTY STATE --------------------------------------------- */}
      <section className={styles.section} aria-labelledby="empty-h">
        <h2 id="empty-h" className={styles.sectionTitle}>
          EmptyState
        </h2>
        <EmptyState
          icon={<Inbox />}
          title="No drafts yet"
          description="Ideas you haven't started will show here. Capture one in two taps."
          primaryAction={
            <Button leadingIcon={<Plus />}>Capture an idea</Button>
          }
          secondaryAction={<Button variant="text">Learn more</Button>}
        />
      </section>

      {/* SKELETON ------------------------------------------------ */}
      <section className={styles.section} aria-labelledby="skel-h">
        <h2 id="skel-h" className={styles.sectionTitle}>
          Skeleton
        </h2>
        <div className={styles.col}>
          <Skeleton width={80} height={80} shape="rect" />
          <Skeleton width="80%" height={14} />
          <Skeleton width="60%" height={14} />
          <Skeleton width={48} height={48} shape="circle" />
        </div>
      </section>

      {/* BOTTOM NAV ---------------------------------------------- */}
      <section className={styles.section} aria-labelledby="nav-h">
        <h2 id="nav-h" className={styles.sectionTitle}>
          BottomNav
        </h2>
        <p className={styles.sectionMeta}>
          Active tab carries <span className={styles.mono}>aria-current</span>.
          The center FAB is not a tab — it always opens Quick Capture.
        </p>
        <div className={styles.bottomNavFrame}>
          <BottomNav
            activeKey={navTab}
            onFabClick={() => setSheetOpen(true)}
            fabIcon={<Plus />}
            fabLabel="Quick capture"
            tabs={[
              {
                key: "today",
                label: "Today",
                icon: <Home />,
                onClick: () => setNavTab("today"),
              },
              {
                key: "plan",
                label: "Plan",
                icon: <Calendar />,
                onClick: () => setNavTab("plan"),
              },
              {
                key: "board",
                label: "Board",
                icon: <Columns3 />,
                onClick: () => setNavTab("board"),
              },
              {
                key: "stats",
                label: "Stats",
                icon: <BarChart3 />,
                onClick: () => setNavTab("stats"),
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
