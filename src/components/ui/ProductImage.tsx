"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

/**
 * Fills its (relatively positioned) parent with a product image.
 * Real photos (jpg/png/webp/avif) go through the Next.js image optimizer;
 * the generated SVG placeholders are served as they are.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={src.endsWith(".svg")}
      className={`object-cover ${className}`}
    />
  );
}

/** A ProductImage that crossfades whenever `src` changes (colorway swaps). */
export function SwapImage(props: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={props.src}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <ProductImage {...props} />
      </motion.div>
    </AnimatePresence>
  );
}
