import Link from "next/link";
import { BrandMark } from "@/components/storefront/BrandMark";
import { Footer } from "@/components/storefront/Pricing";

export function AccountChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090d]">
      <header className="border-b border-white/8 bg-[#08090d]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Link href="/">
            <BrandMark compact />
          </Link>
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-white">
            Storefront
          </Link>
        </div>
      </header>
      <main className="bg-grid flex flex-1 items-center justify-center px-4 py-16 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}
