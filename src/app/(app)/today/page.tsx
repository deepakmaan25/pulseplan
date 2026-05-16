import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodayClient } from "./TodayClient";

export default async function TodayPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Without env vars (local dev without .env.local), skip auth gating and render directly
  if (supabaseUrl && supabaseKey) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth");
    if (!user.user_metadata?.onboarded) redirect("/onboarding");
  }

  return <TodayClient />;
}
