import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodayClient } from "./TodayClient";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware guarantees user is signed in by the time we reach here,
  // but guard defensively in case env vars are missing (local dev without .env.local).
  if (!user) redirect("/auth");

  if (!user.user_metadata?.onboarded) redirect("/onboarding");

  return <TodayClient />;
}
