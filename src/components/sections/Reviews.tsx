import { site } from "@/config/site";

/**
 * Social proof. While `reviews.isPlaceholder` is true in the config, the
 * section and every card are visibly labeled as placeholders so nothing here
 * can be mistaken for a real customer.
 */
export function Reviews() {
  const { reviews } = site;
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative border-t border-line px-(--gutter) py-28 md:py-44"
    >
      <header className="grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
            {reviews.eyebrow}
          </p>
          <h2 id="reviews-title" data-reveal="lines" className="display text-section mt-6">
            {reviews.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        {reviews.isPlaceholder && (
          <p
            role="note"
            data-reveal="fade"
            className="eyebrow max-w-xs border border-dashed border-accent/70 px-4 py-3 leading-relaxed text-accent md:col-span-4 md:justify-self-end"
          >
            {reviews.placeholderNotice}
          </p>
        )}
      </header>

      <ul className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
        {reviews.items.map((review, i) => (
          <li
            key={i}
            data-reveal="fade"
            className={i === 1 ? "md:mt-14" : i === 2 ? "md:mt-28" : ""}
          >
            <figure className="group flex h-full min-h-80 flex-col justify-between rounded-sm border border-line bg-ink-2 p-7 transition-[translate,border-color] duration-500 ease-out-expo fine:hover:-translate-y-1.5 fine:hover:border-frost/30 md:p-9">
              <div>
                <div className="flex items-center justify-between">
                  <span aria-hidden="true" className="display text-6xl leading-none text-accent">
                    &ldquo;
                  </span>
                  {reviews.isPlaceholder && (
                    <span className="eyebrow border border-dashed border-frost/30 px-2.5 py-1.5 text-mute">
                      Placeholder
                    </span>
                  )}
                </div>
                <blockquote className="mt-2 text-xl leading-snug text-frost/90 md:text-2xl">
                  {review.quote}
                </blockquote>
              </div>
              <figcaption className="mt-10 border-t border-line pt-5">
                <p className="font-semibold">{review.author}</p>
                <p className="eyebrow mt-2 text-mute">{review.meta}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
