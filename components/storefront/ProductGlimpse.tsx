"use client";

import Image from "next/image";
import type { ProductAsset } from "@/lib/assets";
import { ZoomableAsset, ZoomablePreview } from "@/components/storefront/ZoomableAsset";

export function ProductGlimpse({
  asset,
  sizes,
  caption,
  priority = false,
  compactDesktop = false,
}: {
  asset: ProductAsset;
  sizes: string;
  caption: string;
  priority?: boolean;
  compactDesktop?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#07090f] shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className={`flex items-start justify-center ${compactDesktop ? "lg:max-h-[480px]" : ""}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className={`h-auto w-full object-contain object-top ${compactDesktop ? "lg:max-h-[480px]" : ""}`}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#07090f] via-[#07090f]/75 to-transparent" />
      <p className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-medium leading-snug text-zinc-100">
        {caption}
      </p>
    </div>
  );
}

export function LeadSheetGlimpse({
  asset,
  sizes,
  caption,
}: {
  asset: ProductAsset;
  sizes: string;
  caption: string;
}) {
  return (
    <ZoomableAsset asset={asset} sizes={sizes}>
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#07090f] shadow-[0_18px_50px_rgba(0,0,0,0.28)] lg:max-h-[480px]">
          <ZoomablePreview framed={false} pan />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#07090f] via-[#07090f]/80 to-transparent" />
          <p className="pointer-events-none absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-medium leading-snug text-zinc-100">
            {caption}
          </p>
        </div>
        <p className="mt-2 text-xs text-[#c4cdff] lg:hidden">Swipe to explore →</p>
      </div>
    </ZoomableAsset>
  );
}
