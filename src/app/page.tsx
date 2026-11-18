import { Suspense } from "react";
import { ColorwayProvider } from "@/components/providers/ColorwayProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { RevealController } from "@/components/RevealController";
import { StickyBuy } from "@/components/StickyBuy";
import { Stage } from "@/components/stage/Stage";
import { Bundle } from "@/components/sections/Bundle";
import { Details } from "@/components/sections/Details";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Reviews } from "@/components/sections/Reviews";
import { Cursor } from "@/components/ui/Cursor";

export default function Page() {
  return (
    <ColorwayProvider>
      <a
        href="#main"
        className="sr-only z-[90] rounded-full bg-accent px-5 py-3 font-semibold text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <Intro />
      <div aria-hidden="true" className="grain" />
      <Cursor />
      <SmoothScroll />

      <Header />

      <main id="main">
        {/* The product stage stays pinned behind the hero and the bundle section. */}
        <div className="relative">
          <Stage />
          <Hero />
          <Bundle />
        </div>
        <Marquee />
        {/* Suspense boundaries let React hydrate the below-the-fold sections
            in separate, interruptible chunks instead of one long task. */}
        <Suspense>
          <Details />
        </Suspense>
        <Reviews />
        <Suspense>
          <Faq />
        </Suspense>
        <Suspense>
          <FinalCta />
        </Suspense>
      </main>

      <Suspense>
        <Footer />
      </Suspense>
      <Suspense>
        <StickyBuy />
      </Suspense>
      <RevealController />
    </ColorwayProvider>
  );
}
