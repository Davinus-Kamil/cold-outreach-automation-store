import { BuyButton } from "@/components/purchase/BuyButton";
import { Reveal } from "@/components/storefront/Reveal";
import { BrandLogo } from "@/components/storefront/BrandMark";
import { PRODUCT } from "@/lib/product";

function ImportReassurance({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-3 max-w-lg text-xs leading-relaxed text-[var(--muted)] ${className}`}>
      If the included workflow files do not import correctly into your compatible n8n setup, contact us and we&apos;ll
      help troubleshoot the import. If we cannot resolve an eligible import issue, we&apos;ll refund the purchase.
    </p>
  );
}

export function PricingCard() {
  const included = [
    "Connected outreach workflows",
    "Installation guide + readiness checklist",
    "Customization resources and email copy",
    "Lead sheet template",
  ];

  return (
    <section id="pricing" className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[#10131c] px-5 py-8 sm:rounded-[36px] sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,156,255,0.18),transparent_42%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-[#c4cdff]">Introductory Price · Save {PRODUCT.savingsDisplay}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{PRODUCT.name}</h2>
              <p className="mt-4 max-w-lg text-[var(--muted)]">
                One-time purchase. You receive the workflow files, guides, and templates immediately after a verified
                payment.
              </p>
              <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="text-xl text-[var(--muted)] line-through">{PRODUCT.regularPriceDisplay}</p>
                <p className="text-5xl font-semibold tracking-tight sm:text-6xl">{PRODUCT.priceDisplay}</p>
              </div>
              <p className="mt-3 text-sm text-[#c4cdff]">Save {PRODUCT.savingsDisplay} on the reference price.</p>
              <div className="mt-8">
                <BuyButton>Get Instant Access — {PRODUCT.priceDisplay}</BuyButton>
              </div>
              <ImportReassurance />
              <p className="mt-4 text-sm text-[var(--muted)]">
                One-time purchase • Immediate digital access • Secure Razorpay payment
              </p>
            </div>
            <ul className="relative space-y-4 text-zinc-200">
              {included.map((item) => (
                <li key={item} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function SetupHelp() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">Optional</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Need someone to configure it?</h2>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Want done-for-you setup? Setup assistance may be available separately after purchase. It is not included in this
        package.
      </p>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-8 text-center sm:px-6 md:pb-20">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Automate the Repetitive Part of Outreach</h2>
      <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
        Import the workflows, follow the guide, and run a small test batch before going wide. This automates the
        outreach mechanics — your lead quality, offer and messaging still determine whether prospects reply.
      </p>
      <div className="mt-8">
        <BuyButton>Automate My Outreach — {PRODUCT.priceDisplay}</BuyButton>
      </div>
      <div className="mx-auto mt-4 flex max-w-lg justify-center">
        <ImportReassurance className="text-center" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <BrandLogo className="h-9 w-auto max-w-[13rem] sm:h-10 sm:max-w-[15rem]" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <a href="/login" className="hover:text-white">
            My purchase
          </a>
          <p>Digital product. Results depend on your list, offer, and usage.</p>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-[var(--muted)] sm:px-6 sm:pb-6">
        Built by{" "}
        <a
          href="https://ai-phen.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          AI-Phen
        </a>
      </p>
    </footer>
  );
}
