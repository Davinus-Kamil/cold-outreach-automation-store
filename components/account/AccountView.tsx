"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAccountPurchases, requestAccountDownload, type AccountPurchase } from "@/lib/account-client";
import { clearAuthSession, readAuthSession } from "@/lib/auth-session";
import { BrandSymbol } from "@/components/storefront/BrandMark";
import { formatMoneyFromPaise, formatPurchaseDateInIndia } from "@/lib/format";
import { PRODUCT_STORAGE } from "@/lib/product";

export function AccountView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState<AccountPurchase[] | undefined>(undefined);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const session = readAuthSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setEmail(session.email);

    fetchAccountPurchases()
      .then((result) => {
        if (result === null) {
          clearAuthSession();
          router.replace("/login");
          return;
        }
        setPurchases(result);
      })
      .catch(() => {
        setError("Purchases could not be loaded. Try again shortly.");
        setPurchases([]);
      });
  }, [router]);

  async function downloadPackage() {
    setDownloading(true);
    setDownloadError("");
    try {
      const url = await requestAccountDownload();
      window.location.assign(url);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      if (message === "unauthenticated") {
        clearAuthSession();
        router.replace("/login");
        return;
      }
      setDownloadError(
        message && message !== "download_unavailable"
          ? message
          : "A new download link could not be created. Try again shortly.",
      );
    } finally {
      setDownloading(false);
    }
  }

  function signOut() {
    clearAuthSession();
    router.replace("/login");
  }

  if (purchases === undefined) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#11141c] px-8 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <span className="spin-ring mx-auto block" />
        <h1 className="mt-6 text-xl font-semibold">Loading your purchase…</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Checking verified payments for this email.</p>
      </div>
    );
  }

  const purchase = purchases[0];

  return (
    <div className="mx-auto w-full max-w-lg rounded-[28px] bg-[#11141c] px-6 py-8 sm:px-8 sm:py-10">
      <BrandSymbol className="mb-4 h-8 w-8" />
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">Your account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Purchases</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">Signed in as {email}</p>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      {purchase ? (
        <div className="mt-8 rounded-2xl border border-white/10 p-5">
          <p className="text-lg font-medium text-white">{purchase.productName}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {formatPurchaseDateInIndia(purchase.purchasedAt)} · {formatMoneyFromPaise(purchase.amount, purchase.currency)}
          </p>
          <button
            type="button"
            onClick={downloadPackage}
            disabled={downloading}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {downloading ? "Preparing download…" : "Download Complete Package"}
          </button>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Each download link expires after {Math.round(PRODUCT_STORAGE.signedUrlExpirySeconds / 60)} minutes. Your
            verified purchase does not expire. Request a fresh link anytime from this page — you do not need the original
            URL or a payment ID.
          </p>
          {downloadError ? <p className="mt-3 text-sm text-red-300">{downloadError}</p> : null}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/10 p-5">
          <p className="text-zinc-200">No verified purchase was found for this email.</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Sign in with the same email used at checkout, or return to the storefront to buy the package.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Back to storefront
          </Link>
        </div>
      )}

      <button type="button" onClick={signOut} className="mt-6 min-h-12 text-sm text-[#c4cdff]">
        Sign out
      </button>
    </div>
  );
}
