"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandSymbol } from "@/components/storefront/BrandMark";
import { fetchAccountPurchases } from "@/lib/account-client";
import { readAuthSession, sessionFromTokens, storeAuthSession } from "@/lib/auth-session";
import { parseEmail } from "@/lib/customer";
import { PRODUCT, PRODUCT_STORAGE } from "@/lib/product";
import { readPurchaseResult, storePurchaseResult, type PurchaseResult } from "@/lib/purchase-result";

const fieldClass =
  "mt-2 box-border min-h-12 min-w-0 w-full max-w-full rounded-xl border border-white/10 bg-[#0b0d12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b9cff]";

const expiryMinutes = Math.round(PRODUCT_STORAGE.signedUrlExpirySeconds / 60);

type AccessStep = "choice" | "verify" | "correct" | "correct-otp" | "secured";

export function SuccessView() {
  const [result, setResult] = useState<PurchaseResult | null | undefined>(undefined);
  const [step, setStep] = useState<AccessStep>("choice");
  const [nextEmail, setNextEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const emailSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readPurchaseResult();
    setResult(stored);
    if (stored?.emailVerified) {
      setStep("secured");
    }
  }, []);

  useEffect(() => {
    if (!result || result.emailVerified || step === "secured") {
      return;
    }

    let cancelled = false;

    async function revalidate() {
      const stored = readPurchaseResult();
      if (!stored || cancelled) {
        return;
      }

      try {
        const statusResponse = await fetch("/api/purchase/email/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claimToken: stored.claimToken }),
        });
        const status = (await statusResponse.json()) as { email?: string; emailVerified?: boolean };
        if (cancelled) {
          return;
        }
        if (status.emailVerified) {
          persist({
            email: typeof status.email === "string" && status.email ? status.email : stored.email,
            emailVerified: true,
          });
          setStep("secured");
          return;
        }

        const session = readAuthSession();
        if (!session) {
          return;
        }
        const purchases = await fetchAccountPurchases();
        if (cancelled || !purchases) {
          return;
        }
        const verifiedPurchase = purchases.find((purchase) => purchase.emailVerified);
        if (verifiedPurchase && session.email) {
          persist({ email: session.email, emailVerified: true });
          setStep("secured");
        }
      } catch {
        return;
      }
    }

    function onWake() {
      if (document.visibilityState === "hidden") {
        return;
      }
      void revalidate();
    }

    void revalidate();
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("focus", onWake);
    window.addEventListener("storage", onWake);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("focus", onWake);
      window.removeEventListener("storage", onWake);
    };
  }, [result, step]);

  useEffect(() => {
    if (step === "verify" || step === "correct-otp") {
      codeRef.current?.focus();
    }
  }, [step]);

  function persist(patch: Partial<PurchaseResult>) {
    setResult((current) => {
      if (!current) {
        return current;
      }
      const next = { ...current, ...patch };
      storePurchaseResult(next);
      return next;
    });
  }

  function scrollToEmail() {
    emailSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function sendOtp(email: string) {
    const response = await fetch("/api/purchase/email/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, claimToken: result?.claimToken }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(payload.error || "A verification code could not be sent.");
    }
  }

  async function startVerify() {
    if (!result) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await sendOtp(result.email);
      setCode("");
      setStep("verify");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A verification code could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function startCorrection(event: FormEvent) {
    event.preventDefault();
    const parsed = parseEmail(nextEmail);
    if (!parsed) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await sendOtp(parsed);
      setNextEmail(parsed);
      setCode("");
      setStep("correct-otp");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A verification code could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmOtp(event: FormEvent) {
    event.preventDefault();
    const token = code.replace(/\D/g, "");
    if (!/^\d{6}$/.test(token) || !result) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    const email = step === "correct-otp" ? nextEmail.trim().toLowerCase() : result.email;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/purchase/email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, claimToken: result.claimToken }),
      });
      const payload = (await response.json()) as {
        error?: string;
        verified?: boolean;
        email?: string;
        claimToken?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
      };
      if (!response.ok || !payload.verified || !payload.email) {
        setError(payload.error || "That code is invalid or has expired.");
        return;
      }
      persist({
        email: payload.email,
        claimToken: typeof payload.claimToken === "string" ? payload.claimToken : result.claimToken,
        emailVerified: true,
      });
      if (payload.accessToken && payload.refreshToken && typeof payload.expiresIn === "number") {
        storeAuthSession(
          sessionFromTokens({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            email: payload.email,
            expiresIn: payload.expiresIn,
          }),
        );
      }
      setStep("secured");
    } catch {
      setError("Email verification could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  if (result === undefined) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-8 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <span className="spin-ring mx-auto block" />
        <h1 className="mt-6 text-xl font-semibold">Checking your purchase…</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Confirming the verified payment on this device.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-[28px] bg-[#11141c] px-8 py-10">
        <p className="text-xs uppercase tracking-[0.16em] text-red-300">Unavailable</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">No purchase found on this device</h1>
        <p className="mt-4 text-[var(--muted)]">
          If you paid on another device, open My Purchase and enter the checkout email. A 6-digit code proves you own
          that email and recovers the download. You do not need the original link or a payment ID.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Sign in to my purchase
          </Link>
          <Link href="/" className="inline-flex items-center px-2 text-sm text-[#c4cdff]">
            Back to storefront
          </Link>
        </div>
      </div>
    );
  }

  const downloadHref = result.downloadUrl;
  const targetEmail = step === "correct-otp" ? nextEmail.trim().toLowerCase() : result.email;

  return (
    <div className="mx-auto w-full max-w-lg rounded-[28px] bg-[#11141c] px-5 py-8 sm:px-8 sm:py-10">
      <BrandSymbol className="mb-4 h-8 w-8" />
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">Payment verified</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Payment Successful</h1>
      <p className="mt-4 text-zinc-200">{PRODUCT.name}</p>

      <div ref={emailSectionRef} className="mt-8 rounded-2xl border border-white/10 bg-[#0b0d12] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">Your purchase email</p>
        <p className="mt-3 break-all text-xl font-semibold tracking-tight text-white sm:text-2xl">{result.email}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {result.emailVerified
            ? "Email verified"
            : "Payment is verified. Immediate download is available. This email is not confirmed yet."}
        </p>

        {step === "secured" ? (
          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            <p className="text-lg font-semibold text-white">Your future access is secured.</p>
            <p>You can use My Purchase anytime to retrieve the package again from another device.</p>
            <p className="text-[var(--muted)]">
              Download links expire after {expiryMinutes} minutes. Your verified purchase does not.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mt-6 text-lg font-semibold tracking-tight">Secure your future access</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Confirm this email so you can retrieve your package again from another device. Email verification secures
              future access; it is not required for the immediate download.
            </p>

            {step === "choice" ? (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void startVerify()}
                  disabled={busy}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
                >
                  {busy ? "Sending code…" : "Verify email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setNextEmail("");
                    setStep("correct");
                  }}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium text-zinc-200 hover:border-white/30"
                >
                  Use a different email
                </button>
              </div>
            ) : null}

            {step === "correct" ? (
              <form className="mt-5" onSubmit={startCorrection}>
                <label className="block text-sm text-zinc-300" htmlFor="correct-email">
                  Corrected email
                </label>
                <input
                  id="correct-email"
                  className={fieldClass}
                  type="email"
                  autoComplete="email"
                  value={nextEmail}
                  onChange={(event) => setNextEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
                >
                  {busy ? "Sending code…" : "Send code to this email"}
                </button>
                <button
                  type="button"
                  className="mt-3 min-h-12 w-full text-sm text-[#c4cdff]"
                  onClick={() => {
                    setStep("choice");
                    setError("");
                  }}
                >
                  Back
                </button>
              </form>
            ) : null}

            {step === "verify" || step === "correct-otp" ? (
              <form className="mt-5" onSubmit={confirmOtp}>
                <p className="text-sm text-zinc-300">
                  Code sent to <span className="text-white">{targetEmail}</span>
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Enter the 6-digit code from the email. You do not need to click a link.
                </p>
                <label className="mt-4 block text-sm text-zinc-300" htmlFor="success-otp">
                  6-digit code
                </label>
                <input
                  ref={codeRef}
                  id="success-otp"
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
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
                >
                  {busy ? "Verifying…" : "Confirm email"}
                </button>
                <button
                  type="button"
                  className="mt-3 min-h-12 w-full text-sm text-[#c4cdff]"
                  onClick={() => {
                    setStep("choice");
                    setCode("");
                    setError("");
                  }}
                >
                  Back
                </button>
              </form>
            ) : null}
          </>
        )}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 p-5 md:hidden">
        <p className="text-sm font-medium text-zinc-100">Setting up the automation is easier on a laptop or desktop.</p>
        {step !== "secured" ? (
          <button
            type="button"
            onClick={() => {
              scrollToEmail();
              if (step === "choice") {
                void startVerify();
              }
            }}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Secure my future access
          </button>
        ) : (
          <Link
            href="/account"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Open My Purchase
          </Link>
        )}
        {downloadHref ? (
          <a
            href={downloadHref}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium text-zinc-200"
          >
            Download on this phone anyway
          </a>
        ) : (
          <p className="mt-3 text-sm text-red-300">
            {result.fulfilmentError || "The download link is not available yet."}
          </p>
        )}
      </div>

      <div className="mt-6 hidden md:block">
        {downloadHref ? (
          <>
            <a
              href={downloadHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Download Complete Package
            </a>
            <p className="mt-4 text-sm text-[var(--muted)]">
              After unzipping, start with the file named <span className="text-zinc-200">01 — START HERE</span>.
            </p>
          </>
        ) : (
          <p className="text-red-300">
            {result.fulfilmentError || "Your payment was recorded, but the download link is not available yet."}
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Payment is verified and immediate download is available. Download links expire after {expiryMinutes} minutes.
        The purchase itself remains recoverable. After you secure this email, use{" "}
        <span className="text-zinc-200">My Purchase</span> to generate a fresh link later — you do not need this
        original URL.
      </p>
    </div>
  );
}
