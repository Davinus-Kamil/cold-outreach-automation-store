import { ProductGlimpse } from "@/components/storefront/ProductGlimpse";
import { WORKFLOW_ASSETS } from "@/lib/assets";

const workflows = [
  {
    id: "01",
    title: "New Lead Outreach",
    body: "Reads new leads from your sheet, researches the prospect's website, generates AI-assisted personalization, sends the outreach email and updates the lead record.",
    chips: ["Website Research", "AI Personalization", "Gmail Sending", "Sheet Updates"],
    asset: WORKFLOW_ASSETS.outreach,
  },
  {
    id: "02",
    title: "3-Day Follow-Up",
    body: "Finds eligible leads, checks the existing Gmail thread and reply state, generates a follow-up and sends it in the same conversation.",
    chips: ["3-Day Timing", "Thread Check", "AI Follow-Up", "Same Email Thread"],
    asset: WORKFLOW_ASSETS.followUp,
  },
  {
    id: "03",
    title: "Reply Watcher",
    body: "Monitors active email threads, detects replies or bounce states, updates the lead record and alerts the operator when attention is needed.",
    chips: ["Hourly Monitoring", "Reply Detection", "Bounce Detection", "Operator Notification"],
    asset: WORKFLOW_ASSETS.replyWatcher,
  },
];

export function WorkflowShowcase() {
  return (
    <section id="workflows" className="mx-auto max-w-6xl overflow-x-clip px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b9cff]">01 → 02 → 03</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Connected Workflows. One Outreach System.
      </h2>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        From first contact to follow-up and reply detection, each workflow handles a specific part of the outreach
        process.
      </p>

      <div className="relative mt-10 lg:mt-14">
        <span className="absolute bottom-8 left-[18px] top-8 hidden w-px bg-[#8b9cff]/20 lg:block" />
        {workflows.map((workflow, index) => (
          <article key={workflow.id} className="relative pb-10 last:pb-0 lg:pb-16 lg:pl-16">
            {index < workflows.length - 1 ? (
              <span className="absolute bottom-6 left-[14px] hidden text-[#8b9cff]/70 lg:block" aria-hidden="true">
                ↓
              </span>
            ) : null}
            <div className={`grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="min-w-0">
                <p className="font-mono text-sm text-[#8b9cff]">Workflow {workflow.id}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{workflow.title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-[var(--muted)]">{workflow.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {workflow.chips.map((chip) => (
                    <li key={chip} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#c4cdff]">
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0">
                <ProductGlimpse
                  asset={workflow.asset}
                  sizes="(max-width: 430px) 92vw, (max-width: 768px) 94vw, 640px"
                  caption="Included in your package"
                />
                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                  Actual n8n workflow included in the package. Buyers connect their own accounts, credentials and
                  business-specific configuration during installation.
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
