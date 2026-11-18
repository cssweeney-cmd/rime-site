import { site } from "@/config/site";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {site.marquee.map((item) => (
        <li key={item} className="flex items-center">
          <span className="display px-6 text-[clamp(2.5rem,7vw,6rem)] md:px-10">{item}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 text-accent md:size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Running strip of the set's contents. Static (and wrapping) without motion. */
export function Marquee() {
  return (
    <div className="relative z-20 overflow-clip border-y border-line bg-ink py-6 md:py-8">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
