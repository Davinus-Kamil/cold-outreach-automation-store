"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandSymbol } from "@/components/storefront/BrandMark";
import { useCheckout } from "@/components/purchase/CheckoutProvider";
import { parseCustomer, type CustomerDetails } from "@/lib/customer";
import { PRODUCT } from "@/lib/product";
import { storePurchaseResult } from "@/lib/purchase-result";
import type { RazorpayCheckoutResponse } from "@/types/razorpay-checkout";

const fieldClass =
  "mt-2 box-border min-h-12 min-w-0 w-full max-w-full rounded-xl border border-white/10 bg-[#0b0d12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b9cff]";

function waitForRazorpay(): Promise<NonNullable<Window["Razorpay"]>> {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.Razorpay) {
        window.clearInterval(timer);
        resolve(window.Razorpay);
        return;
      }
      if (Date.now() - started > 10000) {
        window.clearInterval(timer);
        reject(new Error("checkout_unavailable"));
      }
    }, 50);
  });
}

export function CheckoutModal() {
  const { isOpen, closeCheckout } = useCheckout();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);
  const [status, setStatus] = useState<"details" | "loading" | "error">("details");
  const [formError, setFormError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    email: "",
    company: "",
    marketingConsent: false,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>("input, button, [href], textarea, select");
    focusable?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !processingRef.current) {
        closeCheckout();
        return;
      }
      if (event.key !== "Tab" || !panel) {
        return;
      }
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (nodes.length === 0) {
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [isOpen, closeCheckout]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    processingRef.current = false;
    setStatus("details");
    setFormError("");
    setPaymentError("");
  }, [isOpen]);

  async function verifyPayment(payload: RazorpayCheckoutResponse, details: CustomerDetails) {
    const verifyResponse = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        customer: details,
      }),
    });

    if (!verifyResponse.ok) {
      const failed = (await verifyResponse.json().catch(() => null)) as { error?: string } | null;
      throw new Error(failed?.error ?? "verify_failed");
    }

    const data = (await verifyResponse.json()) as {
      verified?: boolean;
      downloadUrl?: string;
      fulfilmentError?: string;
      claimToken?: string;
    };
    if (!data.verified) {
      throw new Error("verify_failed");
    }

    return {
      downloadUrl: typeof data.downloadUrl === "string" ? data.downloadUrl : "",
      fulfilmentError: data.fulfilmentError ?? "",
      claimToken: typeof data.claimToken === "string" ? data.claimToken : "",
    };
  }

  async function startCheckout(details: CustomerDetails) {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;
    setStatus("loading");
    setFormError("");
    setPaymentError("");

    try {
      const orderResponse = await fetch("/api/razorpay/order", { method: "POST" });
      if (!orderResponse.ok) {
        throw new Error("order_failed");
      }

      const order = (await orderResponse.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
      };

      const keyId = order.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!order.orderId || !keyId || typeof order.amount !== "number" || !order.currency) {
        throw new Error("order_failed");
      }

      const RazorpayCheckout = await waitForRazorpay();
      const checkout = new RazorpayCheckout({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: PRODUCT.name,
        description: PRODUCT.name,
        order_id: order.orderId,
        prefill: {
          name: details.name,
          email: details.email,
        },
        handler: (response) => {
          void verifyPayment(response, details)
            .then((result) => {
              storePurchaseResult({
                email: details.email,
                downloadUrl: result.downloadUrl,
                fulfilmentError: result.fulfilmentError,
                claimToken: result.claimToken,
                emailVerified: false,
              });
              closeCheckout();
              router.push("/success");
            })
            .catch((error: unknown) => {
              processingRef.current = false;
              setPaymentError(
                error instanceof Error && error.message !== "verify_failed"
                  ? error.message
                  : "Payment could not be verified. Please try again.",
              );
              setStatus("error");
            });
        },
        modal: {
          ondismiss: () => {
            processingRef.current = false;
            setStatus("details");
          },
        },
      });

      checkout.on("payment.failed", () => {
        processingRef.current = false;
        setPaymentError("Payment could not be verified. Please try again.");
        setStatus("error");
      });

      checkout.open();
    } catch {
      processingRef.current = false;
      setPaymentError("Payment could not be verified. Please try again.");
      setStatus("error");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = parseCustomer(customer);
    if (!details) {
      setFormError("Enter your full name and a valid email address.");
      return;
    }
    setCustomer(details);
    void startCheckout(details);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close checkout"
        className="absolute inset-0 bg-black/70"
        onClick={() => {
          if (status !== "loading") {
            closeCheckout();
          }
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative z-10 max-h-[100dvh] w-full min-w-0 max-w-md overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#11141c] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-8 sm:pb-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <BrandSymbol className="mt-0.5 h-8 w-8 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9cff]">Secure checkout</p>
              <h2 id="checkout-title" className="mt-2 text-xl font-semibold">
                Customer details
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            disabled={status === "loading"}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/10 px-3 text-sm text-zinc-300 hover:text-white disabled:opacity-50"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="checkout-name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={customer.name}
              onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="checkout-email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={customer.email}
              onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
              className={fieldClass}
            />
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              We&apos;ll use this email for your purchase confirmation, product access and important
              product-related communication.
            </p>
          </div>
          <div>
            <label htmlFor="checkout-company" className="text-sm font-medium">
              Company / Business Name <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="checkout-company"
              name="company"
              type="text"
              autoComplete="organization"
              value={customer.company}
              onChange={(event) => setCustomer((current) => ({ ...current, company: event.target.value }))}
              className={fieldClass}
            />
          </div>
          <label htmlFor="checkout-marketing" className="flex min-h-12 items-start gap-3 text-sm text-zinc-300">
            <input
              id="checkout-marketing"
              name="marketingConsent"
              type="checkbox"
              checked={customer.marketingConsent}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, marketingConsent: event.target.checked }))
              }
              className="mt-1 h-5 w-5 shrink-0 accent-[#8b9cff]"
            />
            <span>Send me useful automation resources, product updates and occasional offers.</span>
          </label>
          {formError ? <p className="text-sm text-red-300">{formError}</p> : null}
          {status === "error" ? <p className="text-sm text-red-300">{paymentError}</p> : null}
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Processing…" : `Continue to Secure Payment — ${PRODUCT.priceDisplay}`}
          </button>
        </form>
      </div>
    </div>
  );
}
