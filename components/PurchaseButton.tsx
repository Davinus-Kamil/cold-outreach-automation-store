"use client";

import { BuyButton } from "@/components/purchase/BuyButton";
import { PRODUCT } from "@/lib/product";

type PurchaseButtonProps = {
  className?: string;
  label?: string;
};

export function PurchaseButton({
  className,
  label = `Get the Complete Package — ${PRODUCT.priceDisplay}`,
}: PurchaseButtonProps) {
  return <BuyButton className={className}>{label}</BuyButton>;
}
