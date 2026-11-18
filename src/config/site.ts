/**
 * THE one config file.
 *
 * Everything you are likely to change lives here: brand name, copy, price,
 * checkout URL, theme colors, colorways, image paths and optional 3D models.
 *
 * Before launch, search this file for "TODO" and for square brackets like
 * "[X to Y]": those are visible placeholders that need your real numbers.
 */

export type ColorwayId = "frost" | "slate" | "blaze";
export type PieceId = "beanie" | "neck" | "gloves";

export type Colorway = {
  id: ColorwayId;
  name: string;
  blurb: string;
  /** UI swatch color. */
  swatch: string;
  /** Palette used by the 3D placeholders and the generated placeholder art. */
  palette: {
    base: string;
    shade: string;
    light: string;
    /** Fleece lining. */
    lining: string;
    /** Touchscreen fingertip pads and the woven label. */
    pad: string;
    padInk: string;
  };
};

export type Piece = {
  id: PieceId;
  index: string;
  name: string;
  /** Short benefit shown large in the bundle section. */
  benefit: string;
  body: string;
  tags: string[];
  alt: string;
  /** Cutout image per colorway (transparent background works best). */
  images: Record<ColorwayId, string>;
  /**
   * Optional path to a .glb in /public (for example "/models/beanie.glb").
   * When set, it replaces the procedural 3D placeholder for this piece.
   */
  model: string | null;
};

const brandName = "RIME";
const price = "$34.99";

export const site = {
  brand: {
    name: brandName,
    tagline: "Three pieces. Zero cold.",
    description:
      "The Winter Set: a beanie, a fleece-lined neck warmer and touchscreen gloves. One size, one price.",
    season: "Winter Set 001",
    /** Used for metadata. Set to your real domain when you deploy. */
    url: "https://example.com",
  },

  /**
   * Every buy button on the page points here.
   * TODO: replace with your Shopify checkout or cart permalink.
   */
  checkout: {
    url: "https://example.com/checkout",
    /** Open checkout in a new tab. */
    newTab: false,
  },

  product: {
    name: "The Winter Set",
    price,
    priceValue: 34.99,
    currency: "USD",
    summary: "Beanie + neck warmer + touchscreen gloves",
  },

  /** Theme colors. Injected as CSS variables, so Tailwind picks them up. */
  theme: {
    colors: {
      /** Page background (near-black, slightly blue). */
      ink: "#06080b",
      /** Raised surfaces. */
      ink2: "#0d1117",
      ink3: "#161c24",
      /** Primary text (frost white). */
      frost: "#e9eff4",
      /** Secondary text. */
      mute: "#8b98a6",
      /** Hairlines. */
      line: "rgba(233, 239, 244, 0.12)",
      /** The one accent: blaze orange. Try "#7fd4ff" for icy blue. */
      accent: "#ff4d14",
      /** Text on top of the accent. */
      accentInk: "#0a0a0a",
    },
  },

  /**
   * Hero + bundle visuals.
   * - "auto":   real-time 3D where the device supports it, layered images otherwise.
   * - "images": always use the layered images (pick this once you have real
   *             product photos but no .glb models).
   * - mobile3d: load 3D on phones too (after the first touch or scroll).
   */
  stage: {
    mode: "auto" as "auto" | "images",
    mobile3d: true,
  },

  nav: [
    { label: "The set", href: "#bundle" },
    { label: "Details", href: "#details" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ],

  cta: {
    label: "Get the bundle",
    short: "Buy",
  },

  defaultColorway: "frost" as ColorwayId,

  colorways: [
    {
      id: "frost",
      name: "Frost",
      blurb: "Off-white, like first snow before anyone walks on it.",
      swatch: "#e6ebf0",
      palette: {
        base: "#e6ebf0",
        shade: "#9aa8b8",
        light: "#ffffff",
        lining: "#f7f9fb",
        pad: "#ff4d14",
        padInk: "#0a0a0a",
      },
    },
    {
      id: "slate",
      name: "Slate",
      blurb: "Cold blue-grey. Goes with every jacket you own.",
      swatch: "#51647a",
      palette: {
        base: "#51647a",
        shade: "#27313e",
        light: "#7d93ab",
        lining: "#cfd8e2",
        pad: "#ff4d14",
        padInk: "#0a0a0a",
      },
    },
    {
      id: "blaze",
      name: "Blaze",
      blurb: "High-vis orange for low-vis days.",
      swatch: "#ff4d14",
      palette: {
        base: "#ff4d14",
        shade: "#a82a04",
        light: "#ff8a5c",
        lining: "#20252c",
        pad: "#e9eff4",
        padInk: "#0a0a0a",
      },
    },
  ] satisfies Colorway[] as Colorway[],

  /**
   * The three pieces. Copy describes a typical set: edit it to match the
   * product you actually ship (materials, cuff style, which fingers are
   * touchscreen-compatible).
   */
  pieces: [
    {
      id: "beanie",
      index: "01",
      name: "The Beanie",
      benefit: "Warmth that stays put.",
      body: "A close rib knit with a deep fold-over cuff. Pull it down over your ears and forget it's there.",
      tags: ["Rib knit", "Fold-over cuff", "One size"],
      alt: "Rib-knit beanie with a fold-over cuff",
      images: {
        frost: "/products/frost/beanie.svg",
        slate: "/products/slate/beanie.svg",
        blaze: "/products/blaze/beanie.svg",
      },
      model: null,
    },
    {
      id: "neck",
      index: "02",
      name: "The Neck Warmer",
      benefit: "Fleece-lined, all the way round.",
      body: "Soft fleece inside, tight knit outside. Wear it at the collar or pull it up over your nose when the wind picks up.",
      tags: ["Fleece lining", "Pull-up fit", "One size"],
      alt: "Knit neck warmer with a fleece lining",
      images: {
        frost: "/products/frost/neck.svg",
        slate: "/products/slate/neck.svg",
        blaze: "/products/blaze/neck.svg",
      },
      model: null,
    },
    {
      id: "gloves",
      index: "03",
      name: "The Gloves",
      benefit: "Touchscreen fingertips.",
      body: "Conductive pads on the thumb and index finger, so you can text, tap and pay without taking them off.",
      tags: ["Touchscreen pads", "Ribbed cuff", "One size"],
      alt: "Pair of knit gloves with touchscreen fingertip pads",
      images: {
        frost: "/products/frost/gloves.svg",
        slate: "/products/slate/gloves.svg",
        blaze: "/products/blaze/gloves.svg",
      },
      model: null,
    },
  ] satisfies Piece[] as Piece[],

  hero: {
    eyebrow: "Winter Set 001",
    /** The h1. */
    headline: ["Three pieces.", "Zero cold."],
    sub: "Beanie, neck warmer and touchscreen gloves. One set, one size.",
    notes: ["One size", "3 colorways", "Sold as a set"],
    scrollHint: "Scroll",
  },

  bundle: {
    eyebrow: "The set",
    title: "Build the set",
    /** The last beat of the pinned section, after all three pieces land. */
    finale: {
      index: "04",
      name: "The Winter Set",
      benefit: `All three. ${price}.`,
      body: "Everything between your collar and the cold, in one box at one price.",
    },
  },

  marquee: ["Beanie", "Neck warmer", "Touchscreen gloves", "One size", price],

  details: {
    eyebrow: "Details",
    title: ["Cold-proof,", "close up."],
    intro:
      "No size chart, no upsells, no filler. Three pieces that do one job well.",
    /** Close-up images per colorway. Swap with real macro shots (4:5). */
    features: [
      {
        id: "material",
        label: "Material",
        title: "Soft-touch rib knit",
        body: "Dense, stretchy and soft against skin. Warm without the itch.",
        alt: "Close-up of the rib knit texture",
        images: {
          frost: "/products/frost/detail-knit.svg",
          slate: "/products/slate/detail-knit.svg",
          blaze: "/products/blaze/detail-knit.svg",
        } as Record<ColorwayId, string>,
      },
      {
        id: "lining",
        label: "Lining",
        title: "Fleece where it counts",
        body: "The neck warmer is lined with brushed fleece, so the part that touches your face is the softest part.",
        alt: "Close-up of the brushed fleece lining",
        images: {
          frost: "/products/frost/detail-fleece.svg",
          slate: "/products/slate/detail-fleece.svg",
          blaze: "/products/blaze/detail-fleece.svg",
        } as Record<ColorwayId, string>,
      },
      {
        id: "fit",
        label: "Fit",
        title: "One size, real stretch",
        body: "Every piece is cut with enough stretch to fit most adult heads and hands. Nothing to measure.",
        alt: "Close-up of a glove fingertip with a touchscreen pad",
        images: {
          frost: "/products/frost/detail-touch.svg",
          slate: "/products/slate/detail-touch.svg",
          blaze: "/products/blaze/detail-touch.svg",
        } as Record<ColorwayId, string>,
      },
    ],
    colorways: {
      label: "Colorway",
      /** Full-set image per colorway (4:5). */
      images: {
        frost: "/products/frost/set.svg",
        slate: "/products/slate/set.svg",
        blaze: "/products/blaze/set.svg",
      } as Record<ColorwayId, string>,
      alt: "The full winter set: beanie, neck warmer and gloves",
    },
  },

  /**
   * PLACEHOLDER REVIEWS. These are not real customers.
   * Replace `items` with real quotes, then set `isPlaceholder` to false to
   * remove the on-page placeholder labels.
   */
  reviews: {
    eyebrow: "Reviews",
    title: ["Word from", "the cold."],
    isPlaceholder: true,
    placeholderNotice:
      "Placeholder reviews. Replace with real customer quotes before launch.",
    items: [
      {
        quote:
          "Placeholder review. Swap in a real customer quote about how warm the set is.",
        author: "Customer name",
        meta: "Location or order detail",
      },
      {
        quote:
          "Placeholder review. Swap in a real customer quote about the fleece lining or the fit.",
        author: "Customer name",
        meta: "Location or order detail",
      },
      {
        quote:
          "Placeholder review. Swap in a real customer quote about using the gloves on a phone.",
        author: "Customer name",
        meta: "Location or order detail",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: ["Questions,", "answered."],
    items: [
      {
        q: "How fast does it ship?",
        // TODO: replace the bracketed placeholders with your real timings.
        a: "Orders ship within [X to Y] business days. Delivery usually takes another [X to Y] business days, depending on where you are.",
      },
      {
        q: "What is the return policy?",
        // TODO: replace with your real return window and conditions.
        a: "You can return an unworn set within [X] days of delivery. [Add who covers return shipping.]",
      },
      {
        q: "What size is it?",
        a: "One size. The beanie, neck warmer and gloves are all cut with stretch to fit most adults.",
      },
      {
        q: "Do the gloves really work on a phone?",
        a: "Yes. The thumb and index fingertips are touchscreen-compatible, so you can type, swipe and tap without taking them off.",
      },
      {
        q: "Can I buy the pieces separately?",
        a: "Not right now. The beanie, neck warmer and gloves are sold together as one set.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Last call before the cold",
    title: ["Winter", "doesn't wait."],
    sub: `The full set for ${price}.`,
  },

  footer: {
    signup: {
      title: "Cold-weather drops, first.",
      body: "New colorways and restocks, straight to your inbox.",
      placeholder: "Email address",
      button: "Sign up",
      /** UI only: nothing is sent anywhere yet. */
      success: "You're on the list.",
      error: "Enter a valid email address.",
    },
    links: [
      { label: "Shipping", href: "#faq" },
      { label: "Returns", href: "#faq" },
      { label: "Sizing", href: "#faq" },
      // TODO: replace with your support address.
      { label: "Contact", href: "mailto:hello@example.com" },
    ],
    legal: `© 2026 ${brandName}. All rights reserved.`,
  },
};

export type Site = typeof site;

export const colorwayById = (id: ColorwayId): Colorway =>
  site.colorways.find((c) => c.id === id) ?? site.colorways[0];
