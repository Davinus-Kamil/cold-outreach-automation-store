"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What exactly am I purchasing?",
    a: "A digital package: connected n8n workflows, reference guides, an A–Z installation guide, a setup readiness checklist, prompts and email copy guidance, and a lead sheet template.",
  },
  {
    q: "Is this one workflow?",
    a: "No. It's three connected workflows — New Lead Outreach, 3-Day Follow-Up, and Reply Watcher — plus the installation guide, readiness checklist, customization resources and lead sheet template.",
  },
  {
    q: "How do I receive the product?",
    a: "After verified payment, you receive immediate access to download the package from the payment-success page. Your verified purchase can later be accessed securely through My Purchase after email verification.",
  },
  {
    q: "I've never configured n8n before. What do I do?",
    a: "Start with the Setup Readiness Checklist, then follow the complete A–Z Installation Guide step by step. You do not need to build the workflows from scratch, but you will need to connect your own accounts and credentials by following the guide.",
  },
  {
    q: "Do I need n8n?",
    a: "Yes. You need access to n8n to import and run the workflows.",
  },
  {
    q: "Do I need Gmail / Google Workspace?",
    a: "Yes. The workflows use Gmail for sending outreach, checking threads and detecting replies.",
  },
  {
    q: "Do I need Google Sheets?",
    a: "Yes. Google Sheets is used for the lead list and outreach/status tracking. A lead sheet template is included.",
  },
  {
    q: "Do I need Gemini API access?",
    a: "Yes. Gemini API access is used for AI-assisted research/personalization.",
  },
  {
    q: "Can I customize the email?",
    a: "Yes. The package includes customization resources so buyers can adapt prompts/email messaging to their business and offer.",
  },
  {
    q: "Is this a subscription?",
    a: "No. The product itself is a one-time purchase. Third-party services used with the workflows may have their own pricing or usage limits.",
  },
  {
    q: "Will this guarantee clients or replies?",
    a: "No. The package automates outreach mechanics such as research, personalization, sending, follow-up and reply monitoring. Results still depend on factors such as lead quality, offer and messaging.",
  },
  {
    q: "Is done-for-you setup included?",
    a: "No. Done-for-you setup is not included in the ₹1,999 package.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
      <div className="mt-10">
        {faqs.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.q} className="border-t border-white/10 last:border-b">
              <h3>
                <button
                  type="button"
                  id={`faq-button-${index}`}
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${index}`}
                  className="flex min-h-12 w-full items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-medium leading-snug sm:py-5"
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  {item.q}
                  <span className="text-sm text-[#8b9cff]" aria-hidden="true">
                    {expanded ? "–" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
                hidden={!expanded}
                className="pb-5 text-[var(--muted)]"
              >
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
