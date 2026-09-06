"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type CheckoutContextValue = {
  isOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback(() => setIsOpen(true), []);
  const closeCheckout = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openCheckout, closeCheckout }),
    [isOpen, openCheckout, closeCheckout],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}
