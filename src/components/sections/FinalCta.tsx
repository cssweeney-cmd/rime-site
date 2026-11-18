import { site } from "@/config/site";
import { CtaButton } from "@/components/ui/CtaButton";
import { Snow } from "@/components/ui/Snow";

/** The closing pitch: big type, snow, one button. */
export function FinalCta() {
  const { finalCta, product } = site;
  return (
    <section
      id="buy"
      aria-labelledby="buy-title"
      className="relative overflow-clip border-t border-line px-(--gutter) py-32 text-center md:py-52"
    >
      <div aria-hidden="true" className="glow-accent absolute inset-x-0 -bottom-1/3 h-full" />
      <div aria-hidden="true" className="glow-cold absolute inset-0" />
      <Snow density={1.2} />

      <div className="relative">
        <p data-reveal="fade" className="eyebrow text-accent">
          {finalCta.eyebrow}
        </p>
        <h2
          id="buy-title"
          data-reveal="lines"
          className="display mt-8 text-[clamp(4rem,17.5vw,17rem)]"
        >
          {finalCta.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p data-reveal="fade" className="mx-auto mt-8 max-w-md text-lg text-frost/75 md:text-xl">
          {finalCta.sub} {product.summary}.
        </p>
        <div id="final-cta" data-reveal="fade" className="mt-10">
          <CtaButton size="xl" />
        </div>
      </div>
    </section>
  );
}
