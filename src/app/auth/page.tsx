"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setConfirmSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.refresh();
        router.push("/today");
      }
    }

    setLoading(false);
  }

  if (confirmSent) {
    return (
      <div className={styles.screen}>
        <div className={styles.card}>
          <p className={styles.wordmark}>PulsePlan</p>
          <h1 className={styles.heading}>Check your email</h1>
          <p className={styles.sub}>
            We sent a confirmation link to <strong>{email}</strong>. Open it to
            activate your account, then sign in.
          </p>
          <button
            type="button"
            className={styles.linkBtn}
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
        <h1 className={styles.heading}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <p className={styles.sub}>
          {mode === "signin"
            ? "Sign in to your content planner."
            : "Start planning your content."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "8+ characters" : "••••••••"}
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className={styles.toggleRow}>
          {mode === "signin" ? (
            <>
              No account?{" "}
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
              Already have one?{" "}
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
