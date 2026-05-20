import type { ReactNode } from "react";
import { AppShellClient } from "./AppShellClient";
import { PostsProvider } from "@/store/PostsContext";
import { NotificationsProvider } from "@/store/NotificationsContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PostsProvider>
      <NotificationsProvider>
        <AppShellClient>{children}</AppShellClient>
      </NotificationsProvider>
    </PostsProvider>
  );
}
