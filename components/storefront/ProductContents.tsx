const folders = [
  {
    id: "01",
    title: "START HERE",
    files: ["Setup Readiness Checklist"],
  },
  {
    id: "02",
    title: "COMPLETE INSTALLATION GUIDE",
    files: ["Complete Plug-and-Play A–Z Installation Guide"],
  },
  {
    id: "03",
    title: "N8N WORKFLOWS",
    files: [
      "Workflow A — New Lead Outreach",
      "Workflow B — 3-Day Follow-Up",
      "Workflow C — Reply Watcher",
    ],
  },
  {
    id: "04",
    title: "WORKFLOW REFERENCE GUIDES",
    files: ["Workflow reference documentation for the included automations"],
  },
  {
    id: "05",
    title: "CUSTOMIZATION",
    files: ["Prompts, email copy and safe customization guidance"],
  },
  {
    id: "06",
    title: "LEAD SHEET",
    files: ["Lead tracking template used by the workflows"],
  },
];

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <path
        d="M3 7.5H9L11 9.5H21V18.5C21 19.05 20.55 19.5 20 19.5H4C3.45 19.5 3 19.05 3 18.5V7.5Z"
        stroke="#8b9cff"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ProductContents() {
  return (
    <section id="included" className="mx-auto max-w-6xl overflow-x-clip px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Inside Your Download</h2>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">Everything is organized so you know exactly where to begin.</p>

      <ol className="relative mt-12 max-w-3xl">
        <span className="absolute bottom-4 left-[11px] top-4 w-px bg-[#8b9cff]/20" />
        {folders.map((folder) => (
          <li key={folder.id} className="relative pb-8 last:pb-0">
            <div className="flex items-start gap-3">
              <span className="relative z-10 mt-1 h-[22px] w-[22px] shrink-0 rounded-full border border-[#8b9cff]/40 bg-[#08090d]" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  <FolderIcon />
                  <span>
                    {folder.id} — {folder.title}
                  </span>
                </p>
                <ul className="mt-3 space-y-2 border-l border-white/10 pl-6">
                  {folder.files.map((file) => (
                    <li key={file} className="text-sm text-[var(--muted)] transition hover:text-zinc-200">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-2xl text-[var(--muted)]">
        You won&apos;t be left staring at workflow files wondering where to begin.
      </p>
    </section>
  );
}
