"use client";

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
import { AppBar } from "@/components/ui/AppBar/AppBar";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { StatusChip } from "@/components/ui/chips/StatusChip";
import { PlatformChip } from "@/components/ui/chips/PlatformChip";
import { PillarChip } from "@/components/ui/chips/PillarChip";
import { PriorityChip } from "@/components/ui/chips/PriorityChip";
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

  function handleStatusChange(status: PostStatus) {
    updatePost(postId, { status });
    toast({
      message: `Moved to ${STATUS_LABELS[status]}`,
      tone: "success",
    });
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

  // Build action list based on current status
  const actions: Action[] = [];

  if (post.status === "idea") {
    actions.push({
      label: "Start Drafting",
      icon: <FileText size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("draft"),
    });
    actions.push({
      label: "Schedule Directly",
      icon: <CalendarClock size={18} />,
      variant: "default",
      onClick: () => handleStatusChange("sched"),
    });
  }

  if (post.status === "draft") {
    actions.push({
      label: "Send to Review",
      icon: <Send size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("review"),
    });
    actions.push({
      label: "Schedule",
      icon: <CalendarClock size={18} />,
      variant: "default",
      onClick: () => handleStatusChange("sched"),
    });
  }

  if (post.status === "review") {
    actions.push({
      label: "Approve & Schedule",
      icon: <CalendarClock size={18} />,
      variant: "primary",
      onClick: () => handleStatusChange("sched"),
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
      label: "Move Back to Draft",
      icon: <Undo2 size={18} />,
      variant: "default",
      onClick: () => handleStatusChange("draft"),
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
      onClick: () => handleStatusChange("sched"),
    });
  }

  if (post.status === "pub") {
    actions.push({
      label: "View Metrics",
      icon: <Clock size={18} />,
      variant: "default",
      onClick: () =>
        toast({ message: "Metrics available in M3", tone: "default" }),
    });
  }

  return (
    <div className={styles.screen}>
      <AppBar
        variant="compact"
        title={post.postType ?? "Post"}
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

      {/* Status + time */}
      <div className={styles.statusRow}>
        <StatusChip status={post.status} />
        {post.time ? (
          <span className={styles.scheduledTime}>
            <Clock
              size={12}
              style={{ display: "inline", marginRight: 4 }}
              aria-hidden="true"
            />
            {post.time}
          </span>
        ) : null}
      </div>

      {/* Title */}
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{post.title}</h1>
      </div>

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
            <span className={styles.metaLabel}>Date</span>
            <span
              className={styles.metaValue}
              style={{ font: "var(--t-caption)", color: "var(--ink-2)" }}
            >
              {new Date(post.scheduledDate + "T00:00:00").toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </span>
          </div>
        ) : null}
      </div>

      {/* Draft body */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Draft</p>
        <div className={styles.textBlock}>
          <span className={styles.textBlockPlaceholder}>
            Start writing your draft here…
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Notes</p>
        <div className={styles.textBlock}>
          <span className={styles.textBlockPlaceholder}>
            Add notes, links, or references…
          </span>
        </div>
      </div>

      {/* Actions */}
      {post.status !== "pub" && (
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
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
