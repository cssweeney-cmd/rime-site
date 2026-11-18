import type { CSSProperties } from "react";
import { site } from "@/config/site";

/**
 * Page-load intro: the wordmark rises letter by letter, then the whole panel
 * wipes upward to reveal the hero. About 1.4s in total.
 *
 * It is pure CSS (see `.intro` in globals.css), so it starts on first paint
 * and can never get stuck waiting on JavaScript. It is not rendered at all
 * for visitors who prefer reduced motion.
 */
export function Intro() {
  const letters = Array.from(site.brand.name);
  return (
    <div aria-hidden="true" className="intro fixed inset-0 z-[80] place-items-center bg-ink">
      <div className="w-[min(78vw,34rem)]">
        <div className="display overflow-clip text-center text-[clamp(5rem,24vw,13rem)] leading-[0.82]">
          {letters.map((letter, i) => (
            <span key={i} className="intro-letter" style={{ "--i": i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <div className="mt-5 h-px w-full bg-line">
          <div className="intro-bar h-full bg-accent" />
        </div>
        <div className="eyebrow mt-3 flex justify-between text-mute">
          <span>{site.brand.season}</span>
          <span>{site.product.price}</span>
        </div>
      </div>
    </div>
  );
}
