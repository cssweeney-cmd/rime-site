import { site } from "@/config/site";
import { Magnetic } from "./Magnetic";

const SIZES = {
  md: { link: "py-1.5 pl-5 pr-1.5 text-sm gap-3", chip: "px-3 py-1.5 text-xs" },
  lg: { link: "py-2 pl-7 pr-2 text-base gap-4", chip: "px-4 py-2.5 text-sm" },
  xl: { link: "py-2.5 pl-9 pr-2.5 text-lg md:text-xl gap-5", chip: "px-5 py-3.5 text-base" },
} as const;

/** Props for any link that goes to checkout. */
export const checkoutLinkProps = {
  href: site.checkout.url,
  ...(site.checkout.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
};

/**
 * The buy button. Label and price are separate parts ("Get the bundle" +
 * "$34.99"), and every instance points at `site.checkout.url`.
 */
export function CtaButton({
  size = "lg",
  label = site.cta.label,
  className = "",
}: {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <Magnetic className={className}>
      <a
        {...checkoutLinkProps}
        data-cursor="cta"
        className={`group relative inline-flex items-center overflow-hidden rounded-full bg-accent font-semibold tracking-tight text-accent-ink transition-transform duration-300 active:scale-[0.97] ${s.link}`}
      >
        {/* Frost fill that rises on hover. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[101%] rounded-full bg-frost transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
        />
        <span className="relative">{label}</span>
        <span
          className={`relative inline-flex items-center gap-2 rounded-full bg-accent-ink font-mono font-medium text-frost ${s.chip}`}
        >
          {site.product.price}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-3.5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
          </svg>
        </span>
      </a>
    </Magnetic>
  );
}
