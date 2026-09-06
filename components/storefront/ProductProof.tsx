import { LeadSheetGlimpse, ProductGlimpse } from "@/components/storefront/ProductGlimpse";
import { GUIDE_ASSETS, LEAD_SHEET_ASSET, type ProductAsset } from "@/lib/assets";

const panels: Array<{
  id: string;
  badge: string;
  title: string;
  body: string;
  caption: string;
  asset: ProductAsset;
  sizes: string;
  pan?: boolean;
  note?: string;
}> = [
  {
    id: "01",
    badge: "COMPLETE GUIDE",
    title: "Complete A–Z Installation Guide",
    body: "Beginner-friendly walkthrough covering import, connections, placeholders, testing and activation.",
    caption: "Included — complete setup walkthrough",
    asset: GUIDE_ASSETS.installation,
    sizes: "(max-width: 430px) 92vw, (max-width: 1024px) 90vw, 720px",
  },
  {
    id: "02",
    badge: "CHECKLIST",
    title: "Setup Readiness Checklist",
    body: "Know what n8n, Gmail/Google Workspace, Google Sheets, and workflow files you need before installation.",
    caption: "Included in your package",
    asset: GUIDE_ASSETS.checklist,
    sizes: "(max-width: 430px) 92vw, (max-width: 1024px) 90vw, 720px",
  },
  {
    id: "03",
    badge: "CUSTOMIZATION",
    title: "Prompts, Email Copy & Customization Guide",
    body: "Guidance for prompts, email copy, business information, calls to action, and safe workflow customization.",
    caption: "Step-by-step adaptation guidance",
    asset: GUIDE_ASSETS.customization,
    sizes: "(max-width: 430px) 92vw, (max-width: 1024px) 90vw, 720px",
  },
  {
    id: "04",
    badge: "LEAD SHEET",
    title: "Lead Sheet Template",
    body: "The sheet structure used by the automation to track outreach status, send dates, thread IDs, personalization notes, and replies.",
    caption: "Included — structured lead sheet template",
    asset: LEAD_SHEET_ASSET,
    sizes: "(max-width: 768px) 900px, 1100px",
    pan: true,
    note: "Example data shown — fictional leads for demonstration only.",
  },
];

export function ProductProof() {
  return (
    <section className="section-alt overflow-x-clip py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-balance text-[1.75rem] font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          See What You&apos;re Actually Getting
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)] sm:mt-4">
          No mock dashboards or generic templates. These are real resources included with the package.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          {panels.map((panel) => (
            <article
              key={panel.id}
              className="flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#10131c] px-4 py-5 sm:px-6 sm:py-6 lg:px-6 lg:py-6"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-[#8b9cff]">{panel.id}</p>
              <p className="mt-3 inline-flex rounded-full border border-[#8b9cff]/25 bg-[#8b9cff]/10 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-[#c4cdff]">
                {panel.badge}
              </p>
              <h3 className="mt-3 text-pretty text-xl font-semibold tracking-tight sm:text-2xl">{panel.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">{panel.body}</p>
              <div className="mt-5 min-w-0 sm:mt-6">
                {panel.pan ? (
                  <LeadSheetGlimpse asset={panel.asset} sizes={panel.sizes} caption={panel.caption} />
                ) : (
                  <ProductGlimpse
                    asset={panel.asset}
                    sizes="(max-width: 1023px) 92vw, 44vw"
                    caption={panel.caption}
                    compactDesktop
                  />
                )}
              </div>
              {panel.note ? <p className="mt-3 text-sm text-[#c4cdff]">{panel.note}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
