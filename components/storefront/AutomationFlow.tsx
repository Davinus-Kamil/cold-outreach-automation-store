const NODES = [
  "Lead Added",
  "Website Research",
  "AI Personalization",
  "Personalized Email",
  "Follow-Up",
  "Reply Detected",
  "Notification",
];

export function AutomationFlow() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[#0d1018] px-4 py-5 sm:px-6 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(139,156,255,0.12),transparent_40%)]" />
      <p className="relative mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[#8b9cff]">Live system path</p>

      <ol className="relative md:hidden">
        <span className="absolute bottom-2 left-[9px] top-2 w-px bg-[#8b9cff]/30" />
        {NODES.map((node, index) => (
          <li key={node} className="relative flex gap-4 pb-4 last:pb-0">
            <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#8b9cff]/50 bg-[#8b9cff]" />
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wide text-[var(--muted)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-sm font-medium">{node}</p>
            </div>
          </li>
        ))}
      </ol>

      <ol className="relative hidden md:grid md:grid-cols-7 md:gap-1 lg:gap-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[calc(100%/14)] right-[calc(100%/14)] top-[11px] z-0 h-px bg-[#8b9cff]/28"
        />
        {NODES.map((node, index) => (
          <li key={node} className="relative z-10 flex min-w-0 flex-col items-center px-0.5 text-center lg:px-1">
            <span className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full bg-[#c4cdff] ring-4 ring-[#0d1018]" />
            <p className="mt-3 font-mono text-[10px] text-[var(--muted)] lg:text-[11px]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[11px] font-medium leading-snug text-balance lg:text-xs xl:text-sm">{node}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function MiniFlow({ steps }: { steps: string[] }) {
  return (
    <ol className="relative mt-6">
      <span className="absolute bottom-2 left-[7px] top-2 w-px bg-[#8b9cff]/25" />
      {steps.map((step, index) => (
        <li key={step} className="relative flex gap-3 pb-3 last:pb-0">
          <span className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border border-[#8b9cff]/50 bg-[#08090d]" />
          <p className="min-w-0 text-sm leading-relaxed">
            <span className="mr-2 text-[11px] text-[#8b9cff]">{String(index + 1).padStart(2, "0")}</span>
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}
