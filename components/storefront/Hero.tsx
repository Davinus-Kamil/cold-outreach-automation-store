import { BuyButton } from "@/components/purchase/BuyButton";
import { AutomationFlow } from "@/components/storefront/AutomationFlow";
import { PRODUCT } from "@/lib/product";

export function AnnouncementBar() {
  return (
    <div className="border-b border-white/8 bg-[#10131a] px-4 py-2 text-center text-sm text-zinc-300">
      Introductory Price · Save {PRODUCT.savingsDisplay}
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-grid overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[#c4cdff]">Cold Outreach, Without All the Repetitive Work</p>
          <h1 className="mt-3 text-balance text-[1.7rem] font-semibold leading-[1.15] tracking-tight sm:mt-4 sm:text-[2.5rem] lg:text-[2.85rem] lg:leading-[1.12]">
            Turn a Spreadsheet of Leads Into Researched, Personalized Cold Emails — Automatically
          </h1>
          <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-7 sm:gap-4">
            <div>
              <p className="text-sm text-[var(--muted)] line-through">{PRODUCT.regularPriceDisplay}</p>
              <p className="text-[1.85rem] font-semibold leading-none sm:text-3xl">{PRODUCT.priceDisplay}</p>
              <p className="mt-1 text-sm text-[#c4cdff]">Introductory Price · Save {PRODUCT.savingsDisplay}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <BuyButton />
            <a
              href="#included"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white hover:border-white/30"
            >
              See Exactly What&apos;s Included
            </a>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            One-time purchase • Immediate digital access • Secure Razorpay payment
          </p>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:mt-6 sm:text-lg">
            A ready-to-deploy n8n automation package that researches prospects, personalizes emails with AI, sends
            outreach, follows up automatically, detects replies and keeps your lead sheet updated.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
        <AutomationFlow />
      </div>
    </section>
  );
}
