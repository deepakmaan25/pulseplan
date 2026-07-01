import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Max time we'll wait for Supabase to validate the session before giving up.
 * Vercel middleware has a hard ~25s edge limit; an un-bounded auth call that
 * hangs would 504 (MIDDLEWARE_INVOCATION_TIMEOUT). We cap it well under that
 * and FAIL OPEN on timeout/error (see note below).
 */
const AUTH_TIMEOUT_MS = 3000;

/**
 * FAIL-OPEN vs FAIL-CLOSED (deliberate decision):
 * If Supabase is slow/unreachable we let the request THROUGH rather than
 * redirect everyone to /auth. Rationale: a Supabase hiccup should not lock the
 * whole app (including the owner mid-demo). Client-side guards still apply on
 * protected screens. For an app with sensitive data you'd invert this.
 */

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("auth-timeout")), ms),
    ),
  ]);
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Without env vars (local dev without .env.local), skip auth gating entirely.
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { pathname } = request.nextUrl;

  // Refresh session — bounded by a timeout, and never allowed to throw the
  // whole middleware. On timeout/error, `user` stays null and we fail open.
  let user = null;
  try {
    const result = await withTimeout(supabase.auth.getUser(), AUTH_TIMEOUT_MS);
    user = result.data.user;
  } catch (error) {
    // Auth couldn't be verified in time. Fail open: allow the request through
    // and let client-side guards handle protection. Do NOT redirect-loop.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[middleware] auth check failed/timed out:", error);
    }
    return supabaseResponse;
  }

  // Signed-out → force to /auth (exclude /auth itself)
  if (!user && pathname !== "/auth") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Already signed-in → skip auth page
  if (user && pathname === "/auth") {
    const url = request.nextUrl.clone();
    url.pathname = "/today";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  /**
   * Runs on all routes except static assets. If you later find the auth call
   * is still too frequent, narrow this to only the gated areas, e.g.:
   *   matcher: ["/today/:path*", "/plan/:path*", "/board/:path*",
   *             "/analytics/:path*", "/settings/:path*", "/post/:path*",
   *             "/auth"]
   * That skips the auth round-trip on public/unmatched routes entirely.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
