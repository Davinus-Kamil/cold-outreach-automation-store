"use client";

import { useEffect, useRef, useState } from "react";

const journey = [
  "Download the package",
  "Start with the readiness checklist",
  "Follow the A–Z installation guide",
  "Import the three n8n workflows",
  "Connect your accounts and credentials",
  "Customize your business, offer and email details",
  "Test the complete system",
  "Activate and begin using it",
];

export function SetupJourney() {
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(journey.length - 1);
      return;
    }
    const nodes = refs.current.filter((node): node is HTMLLIElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) {
          return;
        }
        const index = nodes.indexOf(visible.target as HTMLLIElement);
        if (index >= 0) {
          setActive(index);
        }
      },
      { threshold: 0.55 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Okay, I bought it. What do I do next?
      </h2>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Setup is a sequence, not a puzzle. Work through it once with a tiny test list before you run live outreach.
      </p>
      <p className="mt-4 text-lg font-medium text-zinc-100">You do not need to build these workflows from scratch.</p>

      <ol className="relative mt-12 md:hidden">
        <span className="absolute bottom-3 left-[11px] top-3 w-px bg-[#8b9cff]/25" />
        {journey.map((step, index) => (
          <li
            key={step}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <span
              className={`relative z-10 mt-1 h-[22px] w-[22px] shrink-0 rounded-full border ${index <= active ? "border-[#8b9cff] bg-[#8b9cff]" : "border-[#8b9cff]/40 bg-[#08090d]"}`}
            />
            <div>
              <p className="text-xs text-[#8b9cff]">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-lg font-medium">{step}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="relative mt-16 hidden md:block">
        <div className="absolute left-0 right-0 top-[13px] h-px bg-[#8b9cff]/20" />
        <div
          className="absolute left-0 top-[13px] h-px bg-[#8b9cff]/70 transition-[width] duration-500"
          style={{ width: `${(active / (journey.length - 1)) * 100}%` }}
        />
        <ol className="grid grid-cols-4 gap-x-6 gap-y-12 lg:grid-cols-8 lg:gap-3">
          {journey.map((step, index) => (
            <li
              key={step}
              ref={(node) => {
                refs.current[index] = node;
              }}
            >
              <span
                className={`relative z-10 mb-4 block h-[26px] w-[26px] rounded-full border ${index <= active ? "border-[#8b9cff] bg-[#8b9cff]" : "border-[#8b9cff]/40 bg-[#08090d]"}`}
              />
              <p className="text-[11px] text-[#8b9cff]">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-medium leading-snug">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
