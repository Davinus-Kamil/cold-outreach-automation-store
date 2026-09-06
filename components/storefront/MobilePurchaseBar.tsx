"use client";

import { useCheckout } from "@/components/purchase/CheckoutProvider";
import { PRODUCT } from "@/lib/product";

export function MobilePurchaseBar() {
  const { isOpen, openCheckout } = useCheckout();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08090d]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={openCheckout}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950"
      >
        Get Complete Package — {PRODUCT.priceDisplay}
      </button>
    </div>
  );
}
