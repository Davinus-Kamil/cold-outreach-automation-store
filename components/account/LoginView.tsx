"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandSymbol } from "@/components/storefront/BrandMark";
import { parseEmail } from "@/lib/customer";
import { readAuthSession, storeAuthSession, sessionFromTokens } from "@/lib/auth-session";

const fieldClass =
  "mt-2 box-border min-h-12 min-w-0 w-full max-w-full rounded-xl border border-white/10 bg-[#0b0d12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b9cff]";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetEmail = parseEmail(searchParams.get("email") ?? "") ?? "";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(presetEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (readAuthSession()) {
      router.replace("/account");
    }
  }, [router]);

  useEffect(() => {
    if (step === "code") {
      codeRef.current?.focus();
    }
  }, [step]);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    const parsed = parseEmail(email);
    if (!parsed) {
      setError("Enter the email used at checkout.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "A sign-in code could not be sent.");
        return;
      }
      setEmail(parsed);
      setStep("code");
    } catch {
      setError("A sign-in code could not be sent.");
    } finally {
      setSending(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    const token = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(token)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setVerifying(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const payload = (await response.json()) as {
        error?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
        email?: string;
      };
      if (
        !response.ok ||
        !payload.accessToken ||
        !payload.refreshToken ||
        !payload.email ||
        typeof payload.expiresIn !== "number"
      ) {
        setError(payload.error || "That code is invalid or has expired.");
        return;
      }

      storeAuthSession(
        sessionFromTokens({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          email: payload.email,
          expiresIn: payload.expiresIn,
        }),
      );
      router.replace("/account");
    } catch {
      setError("Sign-in could not be completed.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-6 py-8 sm:px-8 sm:py-10">
      <BrandSymbol className="mb-4 h-8 w-8" />
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">Already purchased?</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to your purchase</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Enter the email used at checkout. We&apos;ll send you a 6-digit code to securely access your purchase.
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Your original download link may expire, but your verified purchase does not.
      </p>

      {step === "email" ? (
        <form className="mt-8" onSubmit={sendCode}>
          <label className="block text-sm text-zinc-300" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className={fieldClass}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {sending ? "Sending code…" : "Send sign-in code"}
          </button>
        </form>
      ) : (
        <form className="mt-8" onSubmit={verifyCode}>
          <p className="text-sm text-zinc-300">
            Code sent to <span className="text-white">{email}</span>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter the 6-digit code from the email. You do not need to click a link.
          </p>
          <label className="mt-5 block text-sm text-zinc-300" htmlFor="login-code">
            6-digit code
          </label>
          <input
            ref={codeRef}
            id="login-code"
            className={`${fieldClass} tracking-[0.4em]`}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            required
          />
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={verifying}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {verifying ? "Verifying…" : "Verify and continue"}
          </button>
          <button
            type="button"
            className="mt-4 min-h-12 w-full text-sm text-[#c4cdff]"
            onClick={() => {
              setStep("email");
              setCode("");
              setError("");
            }}
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
