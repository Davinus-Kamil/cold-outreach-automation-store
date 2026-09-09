"use client";

import { useCheckout } from "@/components/purchase/CheckoutProvider";
import { PRODUCT } from "@/lib/product";
import { trackUmamiEvent } from "@/lib/umami";

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
      onClick={() => {
        trackUmamiEvent("buy_clicked", location ? { location } : undefined);
        openCheckout();
      }}
      className={className}
    >
      {children ?? `Get the Complete Package — ${PRODUCT.priceDisplay}`}
    </button>
  );
}
