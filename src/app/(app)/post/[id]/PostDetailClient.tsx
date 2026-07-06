"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Lock,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { StatusChip } from "@/components/ui/chips/StatusChip";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import { PillarChip } from "@/components/ui/chips/PillarChip";
import { PriorityChip } from "@/components/ui/chips/PriorityChip";
import { ScheduleSheet } from "@/components/sheets/ScheduleSheet";
import { useLayoutMode } from "@/components/providers";
import { usePosts } from "@/store/PostsContext";
import { useToast } from "@/components/providers/ToastProvider";
import type { PostStatus } from "@/components/ui/chips/StatusChip";
import type { Platform } from "@/components/ui/chips/PlatformChip";
import styles from "./detail.module.css";

const CHAR_LIMITS: Partial<Record<string, number>> = {
  x: 280,
  th: 500,
  ig: 2200,
  li: 3000,
  yt: 5000,
};

const STATUS_LABELS: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "In Review",
  sched: "Scheduled",
  pub: "Published",
  overdue: "Overdue",
};

const ALL_STATUSES: PostStatus[] = ["idea", "draft", "review", "sched", "pub"];

function formatScheduled(date: string, time?: string): string {
  const d = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return time ? `${d} · ${time}` : d;
}

const isEditable = (status: PostStatus) => status !== "pub";

// ── Platform checklists ───────────────────────────────────────────

const CHECKLISTS: Partial<Record<Platform, string[]>> = {
  yt: [
    "Thumbnail 1280×720px",
    "Title ≤70 characters",
    "Description + chapter timestamps",
    "End screen added",
    "Captions reviewed",
  ],
  ig: [
    "Cover frame / thumbnail set",
    "Caption ≤2,200 characters",
    "Hashtags added (max 30)",
    "Location / tags set",
    "CTA included in caption",
  ],
  li: [
    "Hook visible in first 3 lines",
    "CTA in final paragraph",
    "3–5 relevant hashtags",
    "Media or document attached",
  ],
  x: [
    "Under 280 characters",
    "Media or link attached",
    "Thread formatted correctly",
  ],
  th: ["Under 500 characters", "Image or link attached", "Reply-to thread set"],
};

// ── Checklist tab ─────────────────────────────────────────────────

type CheckMap = Record<string, boolean>;

function ChecklistTab({
  platform,
  checks,
  onChange,
}: {
  platform: Platform;
  checks: CheckMap;
  onChange: (key: string, val: boolean) => void;
}) {
  const items = CHECKLISTS[platform] ?? [];
  if (items.length === 0) {
    return (
      <div className={styles.checklistEmpty}>
        <p>No checklist available for this platform yet.</p>
      </div>
    );
  }
  const done = items.filter((item) => checks[item]).length;
  return (
    <div className={styles.checklist}>
      <p className={styles.checklistProgress}>
        {done}/{items.length} complete
      </p>
      {items.map((item) => (
        <label key={item} className={styles.checkItem}>
          <input
            type="checkbox"
            className={styles.checkBox}
            checked={!!checks[item]}
            onChange={(e) => onChange(item, e.target.checked)}
          />
          <span
            className={`${styles.checkLabel} ${checks[item] ? styles.checkLabelDone : ""}`}
          >
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}

// ── Hook variant cards ────────────────────────────────────────────

interface HookCardProps {
  letter: "A" | "B" | "C";
  text: string;
  selected: boolean;
  editable: boolean;
  onSelect: () => void;
  onChange: (text: string) => void;
}

function HookCard({
  letter,
  text,
  selected,
  editable,
  onSelect,
  onChange,
}: HookCardProps) {
  return (
    <div
      className={`${styles.hookCard} ${selected ? styles.hookCardSelected : ""}`}
      onClick={onSelect}
    >
      <div className={styles.hookHeader}>
        <span
          className={`${styles.hookBadge} ${selected ? styles.hookBadgeSelected : ""}`}
        >
          {letter}
        </span>
        {selected && (
          <span className={styles.hookActiveLabel} aria-label="Active hook">
            Active
          </span>
        )}
      </div>
      {editable ? (
        <textarea
          className={styles.hookTextarea}
          placeholder={`Hook angle ${letter}…`}
          value={text}
          onChange={(e) => {
            e.stopPropagation();
            onChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          rows={2}
          aria-label={`Hook variant ${letter}`}
        />
      ) : (
        <p
          className={`${styles.hookText} ${!text ? styles.hookTextEmpty : ""}`}
        >
          {text || `Hook angle ${letter}`}
        </p>
      )}
    </div>
  );
}

interface Action {
  label: string;
  icon: React.ReactNode;
  variant: "default" | "primary" | "danger";
  onClick: () => void;
}

type DetailTab = "editor" | "schedule" | "checklist" | "activity";

// ── Main screen ───────────────────────────────────────────────────

export function PostDetailClient({ postId }: { postId: string }) {
  const router = useRouter();
  const { getPost, updatePost, deletePost } = usePosts();
  const { toast } = useToast();
  const post = getPost(postId);
  const mode = useLayoutMode();

  const [localTitle, setLocalTitle] = useState(() => post?.title ?? "");
  const [localDraft, setLocalDraft] = useState(() => post?.draft ?? "");
  const [localNotes, setLocalNotes] = useState(() => post?.notes ?? "");
  const [tab, setTab] = useState<DetailTab>("editor");
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [checks, setChecks] = useState<CheckMap>({});

  // Hook variants A/B/C — seed A from description if present
  const [hooks, setHooks] = useState<[string, string, string]>(() => [
    post?.description ?? "",
    "",
    "",
  ]);
  const [activeHook, setActiveHook] = useState<0 | 1 | 2>(0);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [localTitle]);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const charLimit = post ? (CHAR_LIMITS[post.platform] ?? null) : null;

  const actionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    function sync() {
      const kbHeight = Math.max(
        0,
        window.innerHeight - (vv?.height ?? window.innerHeight),
      );
      if (actionsRef.current) {
        actionsRef.current.style.paddingBottom =
          kbHeight > 0 ? `${kbHeight}px` : "";
      }
    }
    vv.addEventListener("resize", sync);
    return () => vv.removeEventListener("resize", sync);
  }, []);

  function handleStatusChange(status: PostStatus) {
    updatePost(postId, { status });
    setStatusSheetOpen(false);
    toast({ message: `Moved to ${STATUS_LABELS[status]}`, tone: "success" });
  }

  function handleSchedule(date: string, time: string) {
    updatePost(postId, { status: "sched", scheduledDate: date, time });
    toast({ message: "Post scheduled", tone: "success" });
  }

  function handleDelete() {
    deletePost(postId);
    toast({
      message: "Post deleted",
      tone: "default",
      actionLabel: "UNDO",
      onAction: () => {
        if (post) updatePost(postId, post);
      },
    });
    router.back();
  }

  function toggleCheck(key: string, val: boolean) {
    setChecks((prev) => ({ ...prev, [key]: val }));
  }

  if (!post) {
    return (
      <div className={styles.screen}>
        <AppBar
          variant="compact"
          title="Post"
          style={{ paddingTop: "var(--s-4)" }}
          leading={
            <IconButton
              icon={<ArrowLeft size={20} />}
              label="Back"
              variant="ghost"
              size={40}
              onClick={() => router.back()}
            />
          }
        />
        <div className={styles.notFound}>
          <p className={styles.notFoundTitle}>Post not found</p>
          <p className={styles.notFoundSub}>
            It may have been deleted or moved.
          </p>
        </div>
      </div>
    );
  }

  const editable = isEditable(post.status);

  const actions: Action[] = [];
  if (post.status === "idea") {
    actions.push({
      label: "Start Draft",
      icon: <FileText size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("draft"),
    });
    actions.push({
      label: "Schedule",
      icon: <CalendarClock size={18} />,
      variant: "default",
      onClick: () => setScheduleOpen(true),
    });
  }
  if (post.status === "draft") {
    actions.push({
      label: "Schedule",
      icon: <CalendarClock size={18} />,
      variant: "primary",
      onClick: () => setScheduleOpen(true),
    });
    actions.push({
      label: "Save to Review",
      icon: <Send size={18} />,
      variant: "default",
      onClick: () => handleStatusChange("review"),
    });
  }
  if (post.status === "review") {
    actions.push({
      label: "Approve & Schedule",
      icon: <CalendarClock size={18} />,
      variant: "primary",
      onClick: () => setScheduleOpen(true),
    });
    actions.push({
      label: "Return to Draft",
      icon: <Undo2 size={18} />,
      variant: "default",
      onClick: () => handleStatusChange("draft"),
    });
  }
  if (post.status === "sched") {
    actions.push({
      label: "Mark as Published",
      icon: <CheckCircle2 size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("pub"),
    });
    actions.push({
      label: "Reschedule",
      icon: <CalendarClock size={18} />,
      variant: "default",
      onClick: () => setScheduleOpen(true),
    });
  }
  if (post.status === "overdue") {
    actions.push({
      label: "Mark as Published",
      icon: <CheckCircle2 size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("pub"),
    });
    actions.push({
      label: "Reschedule",
      icon: <CalendarClock size={18} />,
      variant: "default",
      onClick: () => setScheduleOpen(true),
    });
  }
  if (post.status === "pub") {
    actions.push({
      label: "View Insights",
      icon: <Clock size={18} />,
      variant: "default",
      onClick: () =>
        toast({
          message: "Insights available once you connect a platform.",
          tone: "default",
        }),
    });
  }

  const primaryAction = actions.find((a) => a.variant === "primary");

  if (mode === "desktop") {
    return (
      <>
        <div className={styles.deskScreen}>
          <div className={styles.deskPanel}>
            {/* Top bar */}
            <div className={styles.deskTopbar}>
              <button
                type="button"
                className={styles.deskBack}
                onClick={() => router.back()}
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className={styles.deskCrumb}>
                <span className={styles.deskCrumbTop}>
                  {STATUS_LABELS[post.status]}
                </span>
                <span className={styles.deskCrumbMain}>
                  {editable ? "Editing post" : "Viewing post"}
                </span>
              </div>
              <div className={styles.deskTopActions}>
                <button
                  type="button"
                  className={styles.deskBackBtn}
                  onClick={() => router.back()}
                >
                  Back
                </button>
                {primaryAction ? (
                  <button
                    type="button"
                    className={styles.deskPrimaryBtn}
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.deskPrimaryBtn}
                    onClick={() => router.back()}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>

            <div className={styles.deskCols}>
              {/* Main editor */}
              <div className={styles.deskEditor}>
                <button
                  type="button"
                  onClick={() => editable && setStatusSheetOpen(true)}
                  className={styles.statusBtn}
                  aria-label={`Status: ${STATUS_LABELS[post.status]}`}
                >
                  <StatusChip status={post.status} />
                  {editable && (
                    <ChevronRight
                      size={14}
                      className={styles.statusChevron}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {!editable && (
                  <div className={styles.readOnlyNotice} role="status">
                    <Lock size={14} aria-hidden="true" />
                    <span>
                      This post is {STATUS_LABELS[post.status].toLowerCase()}{" "}
                      and read-only. Change its status to edit.
                    </span>
                  </div>
                )}

                {editable ? (
                  <textarea
                    ref={titleRef}
                    className={styles.titleInput}
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onBlur={() => updatePost(postId, { title: localTitle })}
                    rows={1}
                    aria-label="Title"
                  />
                ) : (
                  <h1 className={styles.title}>{post.title}</h1>
                )}

                {post.description ? (
                  <div className={styles.descriptionBlock}>
                    <p className={styles.descriptionText}>{post.description}</p>
                  </div>
                ) : null}

                <div className={styles.hookSection}>
                  <p className={styles.sectionLabel}>Hook variants</p>
                  <div className={styles.hookGrid}>
                    {(["A", "B", "C"] as const).map((letter, i) => (
                      <HookCard
                        key={letter}
                        letter={letter}
                        text={hooks[i] ?? ""}
                        selected={activeHook === i}
                        editable={editable}
                        onSelect={() => setActiveHook(i as 0 | 1 | 2)}
                        onChange={(text) => {
                          const next: [string, string, string] = [...hooks];
                          next[i] = text;
                          setHooks(next);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Draft</p>
                  <div
                    className={`${styles.textBlock} ${styles.textBlockDraft}`}
                  >
                    {editable ? (
                      <textarea
                        className={styles.textArea}
                        placeholder="Start writing your draft here…"
                        value={localDraft}
                        onChange={(e) => setLocalDraft(e.target.value)}
                        onBlur={() => updatePost(postId, { draft: localDraft })}
                        rows={8}
                        aria-label="Draft"
                      />
                    ) : (
                      <span
                        className={
                          localDraft ? undefined : styles.textBlockPlaceholder
                        }
                      >
                        {localDraft || "No draft written."}
                      </span>
                    )}
                  </div>
                  {editable && charLimit !== null && (
                    <p
                      className={`${styles.charCount} ${localDraft.length > charLimit ? styles.charCountOver : ""}`}
                    >
                      {localDraft.length} / {charLimit.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className={styles.section}>
                  <p className={styles.sectionLabel}>Notes</p>
                  <div className={styles.textBlock}>
                    {editable ? (
                      <textarea
                        className={styles.textArea}
                        placeholder="Add notes, links, or references…"
                        value={localNotes}
                        onChange={(e) => setLocalNotes(e.target.value)}
                        onBlur={() => updatePost(postId, { notes: localNotes })}
                        rows={3}
                        aria-label="Notes"
                      />
                    ) : (
                      <span
                        className={
                          localNotes ? undefined : styles.textBlockPlaceholder
                        }
                      >
                        {localNotes || "No notes added."}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Context rail */}
              <aside className={styles.deskRail}>
                <div className={styles.deskRailGroup}>
                  <p className={styles.deskRailLabel}>Details</p>
                  <div className={styles.deskMetaRow}>
                    <span className={styles.deskMetaKey}>Platform</span>
                    <span className={styles.deskMetaVal}>
                      <PlatformChip platform={post.platform} size="sm" />
                    </span>
                  </div>
                  <div className={styles.deskMetaRow}>
                    <span className={styles.deskMetaKey}>Pillar</span>
                    <span className={styles.deskMetaVal}>
                      <PillarChip
                        name={post.pillar.name}
                        color={post.pillar.color}
                        size="sm"
                      />
                    </span>
                  </div>
                  {post.priority ? (
                    <div className={styles.deskMetaRow}>
                      <span className={styles.deskMetaKey}>Priority</span>
                      <span className={styles.deskMetaVal}>
                        <PriorityChip priority={post.priority} />
                      </span>
                    </div>
                  ) : null}
                  {post.postType ? (
                    <div className={styles.deskMetaRow}>
                      <span className={styles.deskMetaKey}>Type</span>
                      <span className={styles.deskMetaVal}>
                        <span className={styles.postTypeBadge}>
                          {post.postType}
                        </span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className={styles.deskRailGroup}>
                  <p className={styles.deskRailLabel}>Schedule</p>
                  <div className={styles.deskMetaRow}>
                    <span className={styles.deskMetaKey}>Date</span>
                    <span className={styles.deskMetaVal}>
                      {post.scheduledDate
                        ? formatScheduled(post.scheduledDate, post.time)
                        : "Not scheduled"}
                    </span>
                  </div>
                  {editable && (
                    <button
                      type="button"
                      className={styles.deskRailBtn}
                      onClick={() => setScheduleOpen(true)}
                    >
                      {post.scheduledDate ? "Reschedule" : "Schedule this post"}
                    </button>
                  )}
                </div>

                <div className={styles.deskRailGroup}>
                  <p className={styles.deskRailLabel}>Checklist</p>
                  <ChecklistTab
                    platform={post.platform}
                    checks={checks}
                    onChange={toggleCheck}
                  />
                </div>

                {editable && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={styles.deskDeleteBtn}
                  >
                    <Trash2 size={16} />
                    Delete post
                  </button>
                )}
              </aside>
            </div>
          </div>
        </div>

        {/* Shared sheets */}
        <Sheet
          open={statusSheetOpen}
          onClose={() => setStatusSheetOpen(false)}
          title="Change Status"
          kicker="Move to"
        >
          <div className={styles.statusOptions}>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleStatusChange(s)}
                className={`${styles.statusOption} ${post.status === s ? styles.statusOptionActive : ""}`}
              >
                <StatusChip status={s} />
                {post.status === s && (
                  <span className={styles.statusOptionCheck}>✓</span>
                )}
              </button>
            ))}
          </div>
        </Sheet>

        <ScheduleSheet
          open={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onSchedule={handleSchedule}
          initialDate={post.scheduledDate}
          initialTime={post.time}
        />
      </>
    );
  }

  const TAB_OPTIONS: { value: DetailTab; label: string }[] = [
    { value: "editor", label: "Editor" },
    { value: "schedule", label: "Schedule" },
    { value: "checklist", label: "Checklist" },
    { value: "activity", label: "Activity" },
  ];

  return (
    <>
      <div className={styles.screen}>
        <AppBar
          variant="compact"
          title="Post"
          style={{ paddingTop: "var(--s-4)" }}
          leading={
            <IconButton
              icon={<ArrowLeft size={20} />}
              label="Back"
              variant="ghost"
              size={40}
              onClick={() => router.back()}
            />
          }
        />

        {/* Tab strip */}
        <div
          className={styles.tabStrip}
          role="tablist"
          aria-label="Post sections"
        >
          {TAB_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`${styles.tabBtn} ${tab === value ? styles.tabBtnActive : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── EDITOR tab ─────────────────────────────────────────── */}
        {tab === "editor" && (
          <>
            {/* Status chip — tappable */}
            <div className={styles.statusRow}>
              <button
                type="button"
                onClick={() => editable && setStatusSheetOpen(true)}
                className={styles.statusBtn}
                aria-label={`Status: ${STATUS_LABELS[post.status]}. ${editable ? "Tap to change." : ""}`}
                aria-haspopup={editable ? "dialog" : undefined}
              >
                <StatusChip status={post.status} />
                {editable && (
                  <ChevronRight
                    size={14}
                    className={styles.statusChevron}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>

            {/* Title */}
            <div className={styles.titleArea}>
              {editable ? (
                <textarea
                  ref={titleRef}
                  className={styles.titleInput}
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={() => {
                    if (localTitle.trim())
                      updatePost(postId, { title: localTitle.trim() });
                  }}
                  rows={1}
                  placeholder="Post title"
                  aria-label="Post title"
                />
              ) : (
                <h1 className={styles.title}>{post.title}</h1>
              )}
            </div>

            {/* Description — brief context line seeded at capture time */}
            {post.description ? (
              <div className={styles.descriptionBlock}>
                <p className={styles.descriptionText}>{post.description}</p>
              </div>
            ) : null}

            {/* Hook variants */}
            <div className={styles.hookSection}>
              <p className={styles.sectionLabel}>Hook variants</p>
              <div className={styles.hookGrid}>
                {(["A", "B", "C"] as const).map((letter, i) => (
                  <HookCard
                    key={letter}
                    letter={letter}
                    text={hooks[i] ?? ""}
                    selected={activeHook === i}
                    editable={editable}
                    onSelect={() => setActiveHook(i as 0 | 1 | 2)}
                    onChange={(text) => {
                      const next: [string, string, string] = [...hooks];
                      next[i] = text;
                      setHooks(next);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Draft */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Draft</p>
              <div className={`${styles.textBlock} ${styles.textBlockDraft}`}>
                {editable ? (
                  <textarea
                    className={styles.textArea}
                    placeholder="Start writing your draft here…"
                    value={localDraft}
                    onChange={(e) => setLocalDraft(e.target.value)}
                    onBlur={() => updatePost(postId, { draft: localDraft })}
                    rows={4}
                    aria-label="Draft"
                  />
                ) : (
                  <span
                    className={
                      localDraft ? undefined : styles.textBlockPlaceholder
                    }
                  >
                    {localDraft || "No draft written."}
                  </span>
                )}
              </div>
              {editable && charLimit !== null && (
                <p
                  className={`${styles.charCount} ${localDraft.length > charLimit ? styles.charCountOver : ""}`}
                >
                  {localDraft.length} / {charLimit.toLocaleString()}
                </p>
              )}
              {!editable && (
                <p className={styles.readOnlyHint}>Published — read only</p>
              )}
            </div>

            {/* Notes */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Notes</p>
              <div className={styles.textBlock}>
                {editable ? (
                  <textarea
                    className={styles.textArea}
                    placeholder="Add notes, links, or references…"
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={() => updatePost(postId, { notes: localNotes })}
                    rows={3}
                    aria-label="Notes"
                  />
                ) : (
                  <span
                    className={
                      localNotes ? undefined : styles.textBlockPlaceholder
                    }
                  >
                    {localNotes || "No notes added."}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SCHEDULE tab ───────────────────────────────────────── */}
        {tab === "schedule" && (
          <div className={styles.metaCard}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Platform</span>
              <span className={styles.metaValue}>
                <PlatformChip platform={post.platform} size="sm" />
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Pillar</span>
              <span className={styles.metaValue}>
                <PillarChip
                  name={post.pillar.name}
                  color={post.pillar.color}
                  size="sm"
                />
              </span>
            </div>
            {post.postType ? (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Type</span>
                <span className={styles.metaValue}>
                  <span className={styles.postTypeBadge}>{post.postType}</span>
                </span>
              </div>
            ) : null}
            {post.priority ? (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Priority</span>
                <span className={styles.metaValue}>
                  <PriorityChip priority={post.priority} />
                </span>
              </div>
            ) : null}
            {post.scheduledDate ? (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Scheduled</span>
                <span className={styles.metaValue}>
                  <span
                    style={{ font: "var(--t-caption)", color: "var(--ink-2)" }}
                  >
                    {formatScheduled(post.scheduledDate, post.time)}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* ── CHECKLIST tab ──────────────────────────────────────── */}
        {tab === "checklist" && (
          <ChecklistTab
            platform={post.platform}
            checks={checks}
            onChange={toggleCheck}
          />
        )}

        {/* ── ACTIVITY tab ───────────────────────────────────────── */}
        {tab === "activity" && (
          <div className={styles.activityEmpty}>
            <p className={styles.activityTitle}>Activity log</p>
            <p className={styles.activitySub}>
              Status changes and edits will appear here.
            </p>
          </div>
        )}

        {/* Sticky action strip */}
        <div ref={actionsRef} className={styles.actions}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`${styles.actionBtn} ${
                action.variant === "primary"
                  ? styles.actionBtnPrimary
                  : action.variant === "danger"
                    ? styles.actionBtnDanger
                    : ""
              }`}
            >
              <span className={styles.actionIcon} aria-hidden="true">
                {action.icon}
              </span>
              {action.label}
            </button>
          ))}
          <div className={styles.divider} />
          <button
            type="button"
            onClick={handleDelete}
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
          >
            <span className={styles.actionIcon} aria-hidden="true">
              <Trash2 size={18} />
            </span>
            Delete
          </button>
        </div>
      </div>

      {/* Status change sheet */}
      <Sheet
        open={statusSheetOpen}
        onClose={() => setStatusSheetOpen(false)}
        title="Change Status"
        kicker="Move to"
      >
        <div className={styles.statusOptions}>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`${styles.statusOption} ${post.status === s ? styles.statusOptionActive : ""}`}
            >
              <StatusChip status={s} />
              {post.status === s && (
                <span className={styles.statusOptionCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      <ScheduleSheet
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSchedule={handleSchedule}
        initialDate={post.scheduledDate}
        initialTime={post.time}
      />
    </>
  );
}
