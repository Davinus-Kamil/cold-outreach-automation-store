"use client";

import { useCheckout } from "@/components/purchase/CheckoutProvider";
import { PRODUCT } from "@/lib/product";

type BuyButtonProps = {
  className?: string;
  children?: React.ReactNode;
  location?: string;
};

const primaryClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70";

export function BuyButton({ className = primaryClass, children, location }: BuyButtonProps) {
  const { openCheckout } = useCheckout();

  return (
    <button
      type="button"
      data-umami-event="buy_clicked"
      {...(location ? { "data-umami-event-location": location } : {})}
      onClick={openCheckout}
      className={className}
    >
      {children ?? `Get the Complete Package — ${PRODUCT.priceDisplay}`}
    </button>
  );
}
