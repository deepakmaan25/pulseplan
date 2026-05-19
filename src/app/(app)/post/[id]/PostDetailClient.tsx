"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";

const CHAR_LIMITS: Partial<Record<string, number>> = {
  x: 280,
  th: 500,
  ig: 2200,
  li: 3000,
  yt: 5000,
};

function formatScheduled(date: string, time?: string): string {
  const d = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return time ? `${d} · ${time}` : d;
}
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { StatusChip } from "@/components/ui/chips/StatusChip";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import { PillarChip } from "@/components/ui/chips/PillarChip";
import { PriorityChip } from "@/components/ui/chips/PriorityChip";
import { ScheduleSheet } from "@/components/sheets/ScheduleSheet";
import { usePosts } from "@/store/PostsContext";
import { useToast } from "@/components/providers/ToastProvider";
import type { PostStatus } from "@/components/ui/chips/StatusChip";
import styles from "./detail.module.css";

const STATUS_LABELS: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "In Review",
  sched: "Scheduled",
  pub: "Published",
  overdue: "Overdue",
};

const isEditable = (status: PostStatus) => status !== "pub";

interface Action {
  label: string;
  icon: React.ReactNode;
  variant: "default" | "primary" | "danger";
  onClick: () => void;
}

export function PostDetailClient({ postId }: { postId: string }) {
  const router = useRouter();
  const { getPost, updatePost, deletePost } = usePosts();
  const { toast } = useToast();
  const post = getPost(postId);

  // Local editable state — initialized lazily so re-renders from context
  // don't reset what the user is currently typing.
  const [localDraft, setLocalDraft] = useState(() => post?.draft ?? "");
  const [localNotes, setLocalNotes] = useState(() => post?.notes ?? "");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const charLimit = post ? (CHAR_LIMITS[post.platform] ?? null) : null;

  function handleStatusChange(status: PostStatus) {
    updatePost(postId, { status });
    toast({
      message: `Moved to ${STATUS_LABELS[status]}`,
      tone: "success",
    });
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

  // Build action list based on current status
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

        {/* Status + postType */}
        <div className={styles.statusRow}>
          <StatusChip status={post.status} />
          {post.postType ? (
            <span className={styles.postTypeBadge}>{post.postType}</span>
          ) : null}
        </div>

        {/* Title */}
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{post.title}</h1>
        </div>

        {/* Description — captured hook/angle */}
        {post.description ? (
          <div className={styles.descriptionBlock}>
            <p className={styles.descriptionText}>{post.description}</p>
          </div>
        ) : null}

        {/* Metadata */}
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
              <span
                className={styles.metaValue}
                style={{ font: "var(--t-caption)", color: "var(--ink-2)" }}
              >
                {formatScheduled(post.scheduledDate, post.time)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Draft body */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Draft</p>
          <div className={styles.textBlock}>
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
                className={localDraft ? undefined : styles.textBlockPlaceholder}
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
                className={localNotes ? undefined : styles.textBlockPlaceholder}
              >
                {localNotes || "No notes added."}
              </span>
            )}
          </div>
          {!editable && (
            <p className={styles.readOnlyHint}>Published — read only</p>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
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
