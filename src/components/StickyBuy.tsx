"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { checkoutLinkProps } from "@/components/ui/CtaButton";

/**
 * Mobile-only buy bar pinned to the bottom of the screen. It appears once the
 * hero button has scrolled away and steps aside while the final CTA is in view.
 */
export function StickyBuy() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const final = document.getElementById("final-cta");
    if (!hero || !final) return;
    let pastHero = false;
    let atFinal = false;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) {
          pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        } else {
          atFinal = entry.isIntersecting;
        }
      }
      setShow(pastHero && !atFinal);
    });
    io.observe(hero);
    io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-out-expo md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4 border-t border-line bg-ink-2/92 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{site.product.name}</p>
          <p className="eyebrow mt-1.5 truncate text-mute">{site.hero.notes[0]}</p>
        </div>
        <a
          {...checkoutLinkProps}
          className="inline-flex shrink-0 items-center gap-3 rounded-full bg-accent py-1.5 pr-1.5 pl-5 text-sm font-semibold text-accent-ink active:scale-[0.97]"
        >
          {site.cta.short}
          <span className="rounded-full bg-accent-ink px-3 py-2 font-mono text-xs font-medium text-frost">
            {site.product.price}
          </span>
        </a>
      </div>
    </div>
  );
}
