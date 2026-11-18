"use client";

import { useRef, type CSSProperties } from "react";
import { site } from "@/config/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionOk } from "@/lib/env";
import { checkoutLinkProps } from "@/components/ui/CtaButton";

/** Fixed header. Slides away when scrolling down, returns when scrolling up. */
export function Header() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !motionOk()) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        el.dataset.hidden = self.direction === 1 && y > 500 ? "true" : "false";
        el.dataset.scrolled = y > 40 ? "true" : "false";
      },
    });
  });

  return (
    <header
      ref={ref}
      className="group fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out-expo data-[hidden=true]:-translate-y-full"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/85 to-transparent opacity-0 transition-opacity duration-500 group-data-[scrolled=true]:opacity-100"
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
