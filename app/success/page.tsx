import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/storefront/BrandMark";
import { Footer } from "@/components/storefront/Pricing";
import { SuccessView } from "@/components/purchase/SuccessView";

export const metadata: Metadata = {
  title: "Payment successful — Cold Outreach Automation System",
  description: "Verified purchase download for the Cold Outreach Automation System.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090d]">
      <header className="border-b border-white/8 bg-[#08090d]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Link href="/">
            <BrandMark compact />
          </Link>
          <Link href="/account" className="text-sm text-[var(--muted)] hover:text-white">
            My purchase
          </Link>
        </div>
      </header>
      <main className="bg-grid flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <SuccessView />
      </main>
      <Footer />
    </div>
  );
}
