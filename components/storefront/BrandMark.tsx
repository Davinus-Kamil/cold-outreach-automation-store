import Image from "next/image";

export const BRAND_LOGO = {
  src: "/brand/cold-outreach-logo.png",
  width: 2172,
  height: 724,
  alt: "Cold Outreach Automation",
} as const;

export const BRAND_SYMBOL = {
  src: "/brand/cold-outreach-symbol.png",
  width: 1254,
  height: 1254,
  alt: "Cold Outreach Automation",
} as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center">
      <Image
        src={BRAND_SYMBOL.src}
        alt={BRAND_SYMBOL.alt}
        width={BRAND_SYMBOL.width}
        height={BRAND_SYMBOL.height}
        sizes="32px"
        priority
        className="h-8 w-8 object-contain min-[360px]:hidden"
      />
      <Image
        src={BRAND_LOGO.src}
        alt={BRAND_LOGO.alt}
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        sizes={
          compact
            ? "(min-width: 1280px) 176px, (min-width: 1024px) 168px, (min-width: 768px) 152px, (min-width: 640px) 132px, 120px"
            : "(min-width: 1024px) 220px, 180px"
        }
        priority
        className={
          compact
            ? "hidden h-auto w-[7.5rem] object-contain object-left min-[360px]:block sm:w-[8.25rem] md:w-[9.5rem] lg:w-[10.5rem] xl:w-[11rem]"
            : "hidden h-10 w-auto max-w-[16rem] object-contain object-left min-[360px]:block md:h-11"
        }
      />
    </span>
  );
}

export function BrandSymbol({
  className = "h-8 w-8",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_SYMBOL.src}
      alt=""
      width={BRAND_SYMBOL.width}
      height={BRAND_SYMBOL.height}
      sizes="40px"
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}

export function BrandLogo({
  className = "h-10 w-auto max-w-[14rem]",
}: {
  className?: string;
}) {
  return (
    <Image
      src={BRAND_LOGO.src}
      alt={BRAND_LOGO.alt}
      width={BRAND_LOGO.width}
      height={BRAND_LOGO.height}
      sizes="220px"
      className={`object-contain object-left ${className}`}
    />
  );
}
