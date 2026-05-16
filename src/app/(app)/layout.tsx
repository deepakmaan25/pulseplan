import type { ReactNode } from "react";
import { AppShellClient } from "./AppShellClient";
import { PostsProvider } from "@/store/PostsContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PostsProvider>
      <AppShellClient>{children}</AppShellClient>
    </PostsProvider>
  );
}
