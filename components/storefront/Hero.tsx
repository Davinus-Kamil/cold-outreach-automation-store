import Image from "next/image";
import { BuyButton } from "@/components/purchase/BuyButton";
import { AutomationFlow } from "@/components/storefront/AutomationFlow";
import { PRODUCT } from "@/lib/product";

const HERO_VISUAL = {
  src: "/products/hero/cold-outreach-automation-hero.png",
  alt: "Cold Outreach Automation workflow showing lead research, AI personalization, email sending, follow-up and reply tracking",
  width: 1536,
  height: 1024,
} as const;

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
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#c4cdff]">Cold Outreach, Without All the Repetitive Work</p>
            <h1 className="mt-3 text-balance text-[1.7rem] font-semibold leading-[1.15] tracking-tight sm:mt-4 sm:text-[2.5rem] lg:text-[2.85rem] lg:leading-[1.12]">
              Turn a Spreadsheet of Leads Into Researched, Personalized Cold Emails — Automatically
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:mt-5 sm:text-lg">
              A ready-to-deploy n8n automation package that researches prospects, personalizes emails with AI, sends
              outreach, follows up automatically, detects replies and keeps your lead sheet updated.
            </p>
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
          </div>
          <div className="relative mx-auto w-full min-w-0 max-w-xl lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,156,255,0.16),transparent_68%)]"
            />
            <Image
              src={HERO_VISUAL.src}
              alt={HERO_VISUAL.alt}
              width={HERO_VISUAL.width}
              height={HERO_VISUAL.height}
              priority
              sizes="(max-width: 639px) 92vw, (max-width: 1023px) 36rem, (max-width: 1280px) 42vw, 520px"
              className="h-auto w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
        <AutomationFlow />
      </div>
    </section>
  );
}
