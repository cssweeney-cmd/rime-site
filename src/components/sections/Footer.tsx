import { site } from "@/config/site";
import { SignupForm } from "@/components/ui/SignupForm";

export function Footer() {
  const { footer, brand, nav } = site;
  return (
    <footer className="relative overflow-clip border-t border-line px-(--gutter) pt-16 pb-28 md:pt-24 md:pb-10">
      <div className="grid gap-x-10 gap-y-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="text-3xl leading-[1.05] font-semibold tracking-tight [font-stretch:80%] md:text-5xl">
            {footer.signup.title}
          </h2>
          <p className="mt-3 max-w-sm text-frost/70">{footer.signup.body}</p>
          <SignupForm />
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-8">
          <div>
            <p className="eyebrow text-mute">Explore</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-frost/85 transition-colors hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-mute">Help</p>
            <ul className="mt-5 space-y-3">
              {footer.links.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-frost/85 transition-colors hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div
        aria-hidden="true"
        className="display mt-16 text-center text-[clamp(6rem,34vw,34rem)] leading-[0.74] text-frost/[0.07] select-none md:mt-24"
      >
        {brand.name}
      </div>

      <div className="eyebrow mt-8 flex flex-col gap-3 border-t border-line pt-6 text-mute md:flex-row md:justify-between">
        <p>{footer.legal}</p>
        <p>
          {brand.season} / {site.product.price}
        </p>
      </div>
    </footer>
  );
}
