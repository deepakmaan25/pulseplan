"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { POSTS as FIXTURES, type MockPost } from "@/mocks/fixtures";
import type { PostStatus } from "@/components/ui/chips/StatusChip";

let _nextId = 200;

interface PostsCtx {
  posts: MockPost[];
  getPost: (id: string) => MockPost | undefined;
  addPost: (draft: Omit<MockPost, "id">) => MockPost;
  updatePost: (id: string, updates: Partial<Omit<MockPost, "id">>) => void;
  deletePost: (id: string) => void;
}

const Ctx = createContext<PostsCtx | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [extras, setExtras] = useState<MockPost[]>([]);
  const [overrides, setOverrides] = useState<Map<string, Partial<MockPost>>>(
    new Map(),
  );
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const posts = useMemo((): MockPost[] => {
    const base = FIXTURES.filter((p) => !deletedIds.has(p.id)).map((p) => ({
      ...p,
      ...overrides.get(p.id),
    }));
    const added = extras.filter((p) => !deletedIds.has(p.id));
    return [...base, ...added];
  }, [extras, overrides, deletedIds]);

  const getPost = useCallback(
    (id: string) => posts.find((p) => p.id === id),
    [posts],
  );

  const addPost = useCallback((draft: Omit<MockPost, "id">): MockPost => {
    const post: MockPost = { ...draft, id: String(++_nextId) };
    setExtras((prev) => [post, ...prev]);
    return post;
  }, []);

  const updatePost = useCallback(
    (id: string, updates: Partial<Omit<MockPost, "id">>) => {
      // For extras — patch in place
      setExtras((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      );
      // For fixture posts — store in overrides map
      setOverrides((prev) => {
        const next = new Map(prev);
        next.set(id, { ...next.get(id), ...updates });
        return next;
      });
    },
    [],
  );

  const deletePost = useCallback((id: string) => {
    setDeletedIds((prev) => new Set([...prev, id]));
  }, []);

  // Also expose a restore for UNDO
  const value = useMemo(
    (): PostsCtx => ({ posts, getPost, addPost, updatePost, deletePost }),
    [posts, getPost, addPost, updatePost, deletePost],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePosts(): PostsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePosts must be used inside <PostsProvider>");
  return ctx;
}

// Convenience hook — just the status update
export function useUpdateStatus() {
  const { updatePost } = usePosts();
  return (id: string, status: PostStatus) => updatePost(id, { status });
}
