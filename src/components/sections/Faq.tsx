"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { site } from "@/config/site";

/** FAQ accordion. One item open at a time; the first starts open. */
export function Faq() {
  const { faq } = site;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative grid gap-x-10 gap-y-12 border-t border-line px-(--gutter) py-28 md:grid-cols-12 md:py-44"
    >
      <div className="md:col-span-5">
        <div className="md:sticky md:top-28">
          <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
            {faq.eyebrow}
          </p>
          <h2
            id="faq-title"
            data-reveal="lines"
            className="display mt-6 text-[clamp(3rem,7vw,6.5rem)]"
          >
            {faq.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="md:col-span-7">
        <ul className="border-t border-line">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal="fade" className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-button-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                  >
                    <span className="flex items-baseline gap-5">
                      <span aria-hidden="true" className="eyebrow text-mute tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent md:text-2xl">
                        {item.q}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative grid size-10 shrink-0 place-items-center rounded-full border transition-[rotate,background-color,border-color] duration-500 ease-out-expo ${
                        isOpen ? "rotate-45 border-accent bg-accent text-accent-ink" : "border-line text-frost"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M8 2.5v11M2.5 8h11" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  inert={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="faq-panel overflow-hidden"
                >
                  <p className="max-w-xl pb-8 pl-[2.6rem] text-frost/75 md:text-lg">{item.a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
