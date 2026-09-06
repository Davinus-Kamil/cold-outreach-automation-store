"use client";

import { useState } from "react";

export function VideoSection() {
  const [active, setActive] = useState(false);

  return (
    <section className="section-alt py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b9cff]">Walkthrough</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">See the system in context</h2>
            <p className="mt-4 max-w-md text-[var(--muted)]">
              A product walkthrough can be embedded here later. The player stays unloaded until you choose to play, so
              the page does not pull third-party video code on first load.
            </p>
          </div>
          <figure>
            <div className="overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              {active ? (
                <div className="aspect-video bg-[#07080c]">
                  <p className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400">
                    Video embed slot is ready. No external player is connected yet.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive(true)}
                  className="relative flex aspect-video w-full items-center justify-center bg-[linear-gradient(145deg,#141826,#0a0c12_55%,#161b2c)]"
                >
                  <span className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,rgba(139,156,255,0.25),transparent_36%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:auto,28px_28px,28px_28px]" />
                  <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-semibold text-zinc-950 shadow-lg">
                    Play
                  </span>
                </button>
              )}
            </div>
            <figcaption className="mt-3 text-sm text-[var(--muted)]">
              Product walkthrough poster — actual video will load only after you press play.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
