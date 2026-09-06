"use client";

import { CheckoutModal } from "@/components/purchase/CheckoutModal";
import { CheckoutProvider } from "@/components/purchase/CheckoutProvider";

export function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutProvider>
      {children}
      <CheckoutModal />
    </CheckoutProvider>
  );
}
