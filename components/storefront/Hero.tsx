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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 lg:items-center lg:gap-x-10 xl:gap-x-12">
          <p className="text-sm font-medium text-[#c4cdff] lg:col-start-1">
            Cold Outreach, Without All the Repetitive Work
          </p>
          <h1 className="mt-3 text-balance text-[1.7rem] font-semibold leading-[1.15] tracking-tight sm:mt-4 sm:text-[2.5rem] lg:col-start-1 lg:text-[2.85rem] lg:leading-[1.12]">
            Turn a Spreadsheet of Leads Into{" "}
            <span className="text-[#8b9cff]">Researched,</span>{" "}
            <span className="text-[#8b9cff]">Personalized</span> Cold Emails —{" "}
            <span className="text-[#8b9cff]">Automatically</span>
          </h1>
          <div className="relative mx-auto mt-5 w-full min-w-0 md:max-w-2xl lg:col-start-2 lg:row-start-1 lg:row-span-6 lg:mx-0 lg:mt-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,156,255,0.1),transparent_72%)] lg:-inset-4"
            />
            <Image
              src={HERO_VISUAL.src}
              alt={HERO_VISUAL.alt}
              width={HERO_VISUAL.width}
              height={HERO_VISUAL.height}
              priority
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 42rem, (max-width: 1280px) 50vw, 640px"
              className="h-auto w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            />
          </div>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:col-start-1">
            A ready-to-deploy n8n automation package that researches prospects, personalizes emails with AI, sends
            outreach, follows up automatically, detects replies and keeps your lead sheet updated.
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-7 sm:gap-4 lg:col-start-1">
            <div>
              <p className="text-sm text-[var(--muted)] line-through">{PRODUCT.regularPriceDisplay}</p>
              <p className="text-[1.85rem] font-semibold leading-none sm:text-3xl">{PRODUCT.priceDisplay}</p>
              <p className="mt-1 text-sm text-[#c4cdff]">Introductory Price · Save {PRODUCT.savingsDisplay}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row lg:col-start-1">
            <BuyButton />
            <a
              href="#included"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white hover:border-white/30"
            >
              See Exactly What&apos;s Included
            </a>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)] lg:col-start-1">
            One-time purchase • Immediate digital access • Secure Razorpay payment
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-16">
        <AutomationFlow />
      </div>
    </section>
  );
}
