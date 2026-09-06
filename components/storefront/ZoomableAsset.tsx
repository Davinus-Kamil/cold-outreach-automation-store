"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProductAsset } from "@/lib/assets";

type ZoomContextValue = {
  asset: ProductAsset;
  sizes: string;
  priority: boolean;
  open: () => void;
};

const ZoomContext = createContext<ZoomContextValue | null>(null);

function useZoom() {
  const value = useContext(ZoomContext);
  if (!value) {
    throw new Error("Zoomable preview must be used inside ZoomableAsset");
  }
  return value;
}

type ZoomableAssetProps = {
  asset: ProductAsset;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  pan?: boolean;
  panHint?: string;
  showPreviewButton?: boolean;
  children?: ReactNode;
};

export function ZoomableAsset({
  asset,
  sizes,
  className = "",
  imageClassName = "",
  priority = false,
  pan = false,
  panHint,
  showPreviewButton = false,
  children,
}: ZoomableAssetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const previousTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouch;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const ctx: ZoomContextValue = {
    asset,
    sizes,
    priority,
    open: () => setOpen(true),
  };

  return (
    <ZoomContext.Provider value={ctx}>
      {children ?? (
        <div className={className}>
          <ZoomablePreview pan={pan} panHint={panHint} imageClassName={imageClassName} />
          {showPreviewButton ? <ZoomablePreviewButton /> : null}
        </div>
      )}
      {open ? <AssetLightbox asset={asset} onClose={() => setOpen(false)} /> : null}
    </ZoomContext.Provider>
  );
}

export function ZoomablePreview({
  pan = false,
  panHint,
  className = "",
  imageClassName = "",
  framed = true,
}: {
  pan?: boolean;
  panHint?: string;
  className?: string;
  imageClassName?: string;
  framed?: boolean;
}) {
  const { asset, sizes, priority, open } = useZoom();
  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      priority={priority}
      className={`h-auto object-contain object-top ${pan ? "w-[720px] max-w-none lg:max-h-[480px] lg:w-full lg:max-w-full" : "w-full"} ${imageClassName}`}
    />
  );
  const frameClass = framed
    ? "overflow-hidden rounded-xl border border-white/10 bg-[#0b0d12] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
    : "";

  if (pan) {
    return (
      <div className={className}>
        <div className={`overflow-x-auto overscroll-x-contain [scrollbar-width:thin] ${frameClass}`}>
          <button
            type="button"
            onClick={open}
            className="block min-w-[720px] text-left lg:min-w-0 lg:w-full"
            aria-label={`Enlarge ${asset.alt}`}
          >
            {image}
          </button>
        </div>
        {panHint ? <p className="mt-2 text-xs text-[#c4cdff] lg:hidden">{panHint}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className={`block w-full text-left ${frameClass} ${className}`}
      aria-label={`Enlarge ${asset.alt}`}
    >
      {image}
    </button>
  );
}

export function ZoomablePreviewButton({ className = "" }: { className?: string }) {
  const { open } = useZoom();
  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-5 text-sm font-medium text-white hover:border-white/28 ${className}`}
    >
      Preview
    </button>
  );
}

function AssetLightbox({ asset, onClose }: { asset: ProductAsset; onClose: () => void }) {
  const wide = asset.width / asset.height >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Close image" className="absolute inset-0 bg-black/88" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={asset.alt}
        className="relative z-10 flex h-[100dvh] w-full max-w-full flex-col overflow-hidden bg-[#0b0d12] sm:h-auto sm:max-h-[92dvh] sm:max-w-6xl sm:rounded-xl sm:border sm:border-white/10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-20 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-black/70 px-4 text-sm font-medium text-white"
        >
          Close
        </button>
        <div
          className={`min-h-0 flex-1 overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16 ${
            wide ? "overflow-auto" : "overflow-x-hidden overflow-y-auto"
          }`}
        >
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes="100vw"
            className={
              wide
                ? "mx-auto h-auto min-w-[720px] w-[1100px] max-w-none object-contain sm:min-w-0 sm:w-full sm:max-w-full"
                : "mx-auto h-auto w-full max-w-full object-contain"
            }
          />
        </div>
      </div>
    </div>
  );
}
