"use client";

import Link from "next/link";
import { BrandMark } from "@/components/storefront/BrandMark";
import { BuyButton } from "@/components/purchase/BuyButton";
import { PRODUCT } from "@/lib/product";
import { useState } from "react";

const nav = [
  { href: "#workflows", label: "Workflows" },
  { href: "#included", label: "Included" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#08090d]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
        <a href="#top" className="inline-flex shrink-0 items-center">
          <BrandMark compact />
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] lg:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
          <Link href="/login" className="hover:text-white">
            My purchase
          </Link>
          <BuyButton className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
            Get the package — {PRODUCT.priceDisplay}
          </BuyButton>
        </nav>
        <button
          type="button"
          className="inline-flex min-h-12 items-center rounded-full border border-white/10 px-4 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-white/8 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-12 items-center text-sm text-zinc-200"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center text-sm text-zinc-200"
              onClick={() => setOpen(false)}
            >
              My purchase
            </Link>
            <BuyButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
