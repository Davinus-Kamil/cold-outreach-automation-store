"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sessionFromTokens, storeAuthSession } from "@/lib/auth-session";

function readHashParam(hash: string, key: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const value = params.get(key);
  return value && value.length > 0 ? value : null;
}

export function AuthCallbackView() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = readHashParam(window.location.hash, "access_token");
    const refreshToken = readHashParam(window.location.hash, "refresh_token");
    const expiresInRaw = readHashParam(window.location.hash, "expires_in");
    const expiresIn = expiresInRaw ? Number(expiresInRaw) : NaN;

    if (!accessToken || !refreshToken || !Number.isFinite(expiresIn) || expiresIn <= 0) {
      setError("This sign-in link is invalid or has expired. Request a new code.");
      return;
    }

    let cancelled = false;

    fetch("/api/account/purchases", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("unauthenticated");
        }
        const payload = (await response.json()) as { email?: string };
        if (!payload.email) {
          throw new Error("unauthenticated");
        }
        if (cancelled) {
          return;
        }
        storeAuthSession(
          sessionFromTokens({
            accessToken,
            refreshToken,
            email: payload.email,
            expiresIn,
          }),
        );
        window.history.replaceState(null, "", "/auth/callback");
        router.replace("/account");
      })
      .catch(() => {
        if (!cancelled) {
          setError("This sign-in link is invalid or has expired. Request a new code.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-8 py-10">
        <p className="text-xs uppercase tracking-[0.16em] text-red-300">Sign-in failed</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Could not complete sign-in</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">{error}</p>
        <a
          href="/login"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
        >
          Request a new code
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-8 py-12 text-center">
      <span className="spin-ring mx-auto block" />
      <h1 className="mt-6 text-xl font-semibold">Completing sign-in…</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Confirming your email session.</p>
    </div>
  );
}
