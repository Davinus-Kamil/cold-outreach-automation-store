import { Reveal } from "@/components/storefront/Reveal";
import { PRODUCT } from "@/lib/product";

export function BuildVsBuy() {
  const scratch = [
    "Design workflow logic",
    "Gmail threading",
    "Lead-state handling",
    "Follow-up rules",
    "AI prompt structure",
    "Sheet updates",
    "Reply detection",
    "Testing",
    "Documentation",
  ];
  const packaged = [
    "Import three connected workflows",
    "Follow the A–Z installation guide",
    "Use the readiness checklist",
    "Use included email/prompt resources",
    "Use included lead sheet",
    "Connect your own accounts",
    "Customize",
    "Run a small test batch",
    "Activate",
  ];

  return (
    <section className="mx-auto max-w-6xl overflow-x-clip px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Yes — You Could Build It Yourself.</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
          You can assemble this path from a blank n8n canvas. The package exists so you do not have to design, connect,
          document and test every piece before your first send.
        </p>
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          <article className="rounded-[24px] border border-white/10 bg-[#10131c] p-5 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Starting from scratch</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Assemble the system yourself</h3>
            <ul className="mt-6 space-y-3 text-[15px] text-[var(--muted)]">
              {scratch.map((item) => (
                <li key={item} className="border-b border-white/8 pb-3 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[24px] border border-[#8b9cff]/25 bg-[#8b9cff]/8 p-5 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b9cff]">Starting with the package</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Begin from a documented system</h3>
            <ul className="mt-6 space-y-3 text-[15px] text-zinc-100">
              {packaged.map((item) => (
                <li key={item} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0d1018] px-5 py-6 sm:mt-8 sm:px-8 sm:py-8">
          <p className="text-xl font-medium tracking-tight sm:text-2xl">
            {PRODUCT.priceDisplay} isn&apos;t the price of three JSON files.
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            It&apos;s the price of starting further ahead.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function BeginnerReassurance() {
  return (
    <section className="section-alt py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8b9cff]">Beginner-friendly guided setup</p>
        <blockquote className="mt-6 max-w-4xl text-3xl font-semibold leading-[1.2] tracking-tight sm:text-5xl">
          You do not need to build or code these workflows from scratch.
        </blockquote>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          You will need to follow the step-by-step guide to connect your own Google, n8n and AI accounts.
        </p>
      </div>
    </section>
  );
}

export function WhyThisExists() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Why This Exists</h2>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
        This package was built by AI-Phen to turn the repetitive research, personalization, sending, follow-up and
        reply-monitoring steps of cold outreach into a documented automation workflow.
      </p>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
        Instead of giving you theory or leaving you with disconnected workflow files, the package includes the
        workflows, setup documentation, customization resources and lead sheet needed to put the system together.
      </p>
      <p className="mt-5 text-sm text-[var(--muted)]">
        Built by{" "}
        <a
          href="https://ai-phen.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c4cdff] underline-offset-2 hover:underline"
        >
          AI-Phen
        </a>
      </p>
    </section>
  );
}

export function BuyerFit() {
  const goodFit = [
    "Already have, or are willing to set up, an n8n account/instance",
    "Are comfortable following step-by-step instructions to connect API keys and OAuth/account credentials",
    "Send outreach through Gmail or Google Workspace",
    "Have a lead list, or plan to build one, in Google Sheets",
  ];
  const notFit = [
    "Want a completely done-for-you service with zero setup",
    "Don't want to connect your own Google, n8n and AI accounts",
    "Are looking for a full CRM replacement rather than an outreach automation package",
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Is This for You?</h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
        You don&apos;t need to build or code these workflows from scratch. You do need to follow the included setup
        guide to connect your own accounts and credentials.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
        <article className="rounded-[24px] border border-[#8b9cff]/25 border-l-[2px] border-l-[#93b5a6] bg-[#8b9cff]/8 p-5 sm:p-7">
          <h3 className="text-xl font-semibold tracking-tight">Good fit if you:</h3>
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-zinc-100">
            {goodFit.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <FitCheckIcon />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-[24px] border border-white/10 border-l-[2px] border-l-[#c4b392] bg-[#10131c] p-5 sm:p-7">
          <h3 className="text-xl font-semibold tracking-tight">Probably not for you if you:</h3>
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-[var(--muted)]">
            {notFit.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                <FitDashIcon />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    {
      mark: "01",
      title: "Research without opening fifty tabs",
      body: "The first workflow is built to pull website context before the email is drafted.",
    },
    {
      mark: "02",
      title: "Personalization that is editable",
      body: "Prompts and email copy are included so you can match your offer and tone.",
    },
    {
      mark: "03",
      title: "Follow-up without a second memory system",
      body: "A dedicated workflow continues the sequence for leads that still need a nudge.",
    },
    {
      mark: "04",
      title: "Replies stay visible",
      body: "Reply Watcher is there so an answer does not disappear inside a busy inbox.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        What this is designed to take off your plate
      </h2>
      <div className="mt-10 space-y-8 md:mt-14 md:space-y-16">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={`max-w-xl border-t border-white/10 pt-6 ${index % 2 === 1 ? "md:ml-auto" : ""}`}
          >
            <p className="text-xs tracking-[0.16em] text-[#8b9cff]">{item.mark}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-[var(--muted)]">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Requirements() {
  const items = [
    { icon: "n8n", text: "An n8n instance (cloud or self-hosted)" },
    { icon: "sheet", text: "Google Sheets for the lead list" },
    { icon: "mail", text: "Gmail or Google Workspace for sending, according to the guide" },
    { icon: "key", text: "A Gemini API key for personalization, as described in setup" },
    { icon: "box", text: "A mailbox you are allowed to send from" },
    { icon: "time", text: "Time to follow the guide and test with a small list first" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="text-3xl font-semibold tracking-tight">What you need</h2>
      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <li key={item.text} className="flex items-start gap-4 py-4">
            <RequirementIcon name={item.icon} />
            <p className="pt-0.5">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FitCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-[#93b5a6]"
    >
      <path d="M3.5 8.2L6.4 11L12.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FitDashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-[#9aa3b2]"
    >
      <path
        d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RequirementIcon({ name }: { name: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      {name === "n8n" ? <path d="M5 12H19M12 5V19" stroke="#8b9cff" strokeWidth="1.6" strokeLinecap="round" /> : null}
      {name === "sheet" ? <path d="M7 4H17V20H7V4Z M7 9H17 M11 4V20" stroke="#8b9cff" strokeWidth="1.5" /> : null}
      {name === "mail" ? <path d="M4 7H20V17H4V7Z M4 7L12 13L20 7" stroke="#8b9cff" strokeWidth="1.5" /> : null}
      {name === "key" ? (
        <path d="M10 12A3 3 0 1 1 8.2 9.5L19 20M15 16L17 18" stroke="#8b9cff" strokeWidth="1.5" strokeLinecap="round" />
      ) : null}
      {name === "box" ? <rect x="5" y="7" width="14" height="11" rx="2" stroke="#8b9cff" strokeWidth="1.5" /> : null}
      {name === "time" ? (
        <path d="M12 7V12L15 14M12 20A8 8 0 1 0 12 4A8 8 0 0 0 12 20Z" stroke="#8b9cff" strokeWidth="1.5" />
      ) : null}
    </svg>
  );
}

export function ValueJustification() {
  const bundle = [
    {
      id: "01",
      title: "New Lead Outreach Workflow",
      body: "Website research + AI personalization + Gmail outreach + sheet update",
    },
    {
      id: "02",
      title: "3-Day Follow-Up Workflow",
      body: "Eligibility checks + existing thread handling + automatic follow-up",
    },
    {
      id: "03",
      title: "Reply Watcher Workflow",
      body: "Reply monitoring + lead-sheet updates + operator notification",
    },
    {
      id: "04",
      title: "Complete A–Z Installation Guide",
      body: "Step-by-step setup from import through testing",
    },
    {
      id: "05",
      title: "Setup Readiness Checklist",
      body: "Know what accounts, credentials and resources are needed before starting",
    },
    {
      id: "06",
      title: "Customization Resources",
      body: "Prompts, email copy and guidance for adapting the system",
    },
    {
      id: "07",
      title: "Lead Sheet Template",
      body: "Structured starting point for managing outreach leads",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl overflow-x-clip px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9cff]">What you&apos;re actually getting</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
        One Package. The Full Outreach Workflow.
      </h2>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)] sm:text-lg">
        You&apos;re not buying a single automation. You&apos;re getting the connected workflows, setup documentation and
        supporting resources needed to put the system into use.
      </p>

      <ol className="mt-10 space-y-3">
        {bundle.map((item) => (
          <li
            key={item.id}
            className="grid gap-2 rounded-[20px] border border-white/10 bg-[#10131c] px-4 py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-5 sm:px-6"
          >
            <p className="font-mono text-sm text-[#8b9cff]">{item.id}</p>
            <div className="min-w-0">
              <p className="font-medium text-white">{item.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--muted)]">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-[#8b9cff]/25 bg-[#8b9cff]/10 px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#c4cdff]">Complete package</p>
        <p className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{PRODUCT.priceDisplay} one-time</p>
        <p className="mt-3 text-lg text-white">Everything above is included.</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Instead of designing, connecting, documenting and testing each part from scratch, you begin with the complete
          system already structured. n8n, Gmail, Sheets and Gemini remain your own connected services.
        </p>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-[var(--muted)]">
        You could build this from scratch — see the full breakdown above ↑
      </p>

      <div className="mt-6 rounded-[24px] border border-white/10 px-5 py-6 sm:px-8">
        <p className="text-lg font-medium text-white">One purchase. One documented system.</p>
        <p className="mt-3 text-xl font-semibold tracking-tight">
          {PRODUCT.priceDisplay} isn&apos;t the price of three JSON files. It&apos;s the price of starting further ahead.
        </p>
      </div>
    </section>
  );
}
