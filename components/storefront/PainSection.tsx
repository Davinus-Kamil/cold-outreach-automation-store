import { Reveal } from "@/components/storefront/Reveal";

const steps = [
  "Find a lead and open the website",
  "Skim the homepage for something specific",
  "Draft a first line that does not sound templated",
  "Send the email",
  "Remember to follow up later",
  "Check whether they replied",
  "Update the sheet so you do not double-send",
];

export function PainSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              Cold outreach isn&apos;t just “send an email”
            </h2>
            <p className="mt-5 max-w-md text-[var(--muted)]">
              The hidden work is everything around the send: research, personalization, follow-up, reply handling, and
              keeping the list accurate.
            </p>
          </div>
          <ol className="relative">
            <span className="absolute bottom-2 left-[11px] top-2 w-px bg-white/10 sm:left-4" />
            {steps.map((step, index) => (
              <li key={step} className="relative grid grid-cols-[auto_1fr] gap-4 py-3 sm:pl-10">
                <span className="relative z-10 font-mono text-sm text-[#8b9cff]">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-base leading-relaxed sm:text-lg">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

export function ManualVsAutomated() {
  const rows = [
    {
      task: "Website research",
      manual: "Research each website repeatedly",
      packaged: "Workflow 01 handles the research step",
    },
    {
      task: "First-line personalization",
      manual: "Written one by one",
      packaged: "Drafted from researched context",
    },
    {
      task: "Follow-up",
      manual: "Easy to forget",
      packaged: "Timed follow-up workflow",
    },
    {
      task: "Reply handling",
      manual: "Easy to miss",
      packaged: "Reply Watcher updates the sheet",
    },
    {
      task: "Lead status",
      manual: "Scattered notes",
      packaged: "Sheet stays the operator view",
    },
  ];

  return (
    <section className="section-alt py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Manual vs automated</h2>

          <div className="mt-10 hidden md:grid md:grid-cols-3 md:gap-8">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Task</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Manual</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#c4cdff]">This package</p>
          </div>
          <div className="mt-4 hidden md:block">
            {rows.map((row) => (
              <div key={row.task} className="grid gap-8 border-t border-white/10 py-5 md:grid-cols-3">
                <p className="font-medium">{row.task}</p>
                <p className="text-[var(--muted)]">{row.manual}</p>
                <p className="text-zinc-100">{row.packaged}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 md:hidden">
            {rows.map((row) => (
              <article key={row.task} className="rounded-[22px] border border-white/10 bg-[#10131c] p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b9cff]">{row.task}</p>
                <div className="mt-4 rounded-xl bg-[#0b0d12] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Manual</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-200">{row.manual}</p>
                </div>
                <div className="mt-3 rounded-xl border border-[#8b9cff]/20 bg-[#8b9cff]/10 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#c4cdff]">With the package</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-white">{row.packaged}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
