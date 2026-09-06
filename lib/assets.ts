export type ProductAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const WORKFLOW_ASSETS = {
  outreach: {
    src: "/products/workflows/new-lead-outreach.png",
    alt: "Actual n8n New Lead Outreach workflow included in the package",
    width: 1851,
    height: 982,
  },
  followUp: {
    src: "/products/workflows/automatic-follow-up.png",
    alt: "Actual n8n 3-Day Follow-Up workflow included in the package",
    width: 1920,
    height: 1014,
  },
  replyWatcher: {
    src: "/products/workflows/reply-watcher.png",
    alt: "Actual n8n Reply Watcher workflow included in the package",
    width: 1920,
    height: 1010,
  },
} as const satisfies Record<string, ProductAsset>;

export const GUIDE_ASSETS = {
  installation: {
    src: "/products/guides/installation-guide-preview.png",
    alt: "Preview of the complete A–Z installation guide",
    width: 753,
    height: 618,
  },
  checklist: {
    src: "/products/guides/setup-readiness-checklist-preview.png",
    alt: "Preview of the setup readiness checklist",
    width: 743,
    height: 590,
  },
  customization: {
    src: "/products/guides/customization-guide-preview.png",
    alt: "Preview of the customization guide",
    width: 737,
    height: 587,
  },
} as const satisfies Record<string, ProductAsset>;

export const LEAD_SHEET_ASSET: ProductAsset = {
  src: "/products/lead-sheet/lead-sheet-preview.png",
  alt: "Lead sheet template preview with fictional example data",
  width: 1800,
  height: 560,
};
