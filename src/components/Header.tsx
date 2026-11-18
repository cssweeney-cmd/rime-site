"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { site } from "@/config/site";
import { checkoutLinkProps } from "@/components/ui/CtaButton";

/**
 * Fixed header. Slides away when scrolling down, returns when scrolling up,
 * and picks up a blurred backdrop once the page has scrolled.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Ignore sub-pixel jitter so the bar does not flicker.
      if (Math.abs(y - last) > 4) {
        el.dataset.hidden = y > last && y > 500 ? "true" : "false";
        last = y;
      }
      el.dataset.scrolled = y > 40 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="group fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out-expo data-[hidden=true]:-translate-y-full"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-line bg-ink/75 opacity-0 backdrop-blur-md transition-opacity duration-500 group-data-[scrolled=true]:opacity-100"
      />
      <div
        className="rise relative flex items-center justify-between px-(--gutter) py-4 md:py-5"
        style={{ "--d": "0.35s" } as CSSProperties}
      >
        <a
          href="#top"
          aria-label={`${site.brand.name}, back to top`}
          className="display text-3xl leading-none tracking-normal"
        >
          {site.brand.name}
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="eyebrow group/link relative py-2 text-frost/80 transition-colors hover:text-frost"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-accent transition-transform duration-500 ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100"
              />
            </a>
          ))}
        </nav>
        <a
          {...checkoutLinkProps}
          className="eyebrow inline-flex items-center gap-2 rounded-full border border-frost/25 py-2.5 pr-3 pl-4 text-frost transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
        >
          {site.cta.short}
          <span className="font-medium tracking-normal">{site.product.price}</span>
        </a>
      </div>
    </header>
  );
}
