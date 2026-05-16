"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Guard for local dev without .env.local
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      setError(
        "Auth not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local",
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setConfirmSent(true);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Keep loading=true — button stays in "Signing in…" state until navigation unmounts this page
        router.refresh();
        router.push("/today");
      }
    }
  }

  if (confirmSent) {
    return (
      <div className={styles.screen}>
        <div className={styles.card}>
          <p className={styles.wordmark}>PulsePlan</p>
          <div className={styles.confirmBlock}>
            <div className={styles.confirmIcon}>
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>
            <h1 className={styles.heading}>Check your inbox</h1>
            <p className={styles.sub}>
              We sent a link to <strong>{email}</strong>. Click it to verify
              your account, then come back and sign in.
            </p>
          </div>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={() => {
              setConfirmSent(false);
              setMode("signin");
            }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.wordmark}>PulsePlan</p>
        <div className={styles.copyBlock}>
          <h1 className={styles.heading}>
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className={styles.sub}>
            {mode === "signin"
              ? "Pick up where you left off."
              : "Your content, organized."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder={mode === "signup" ? "8+ characters" : "••••••••"}
            />
          </div>

          {error && (
            <p className={styles.errorMsg} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className={styles.toggleRow}>
          {mode === "signin" ? (
            <>
              New to PulsePlan?{" "}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
