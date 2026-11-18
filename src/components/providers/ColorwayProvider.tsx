"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { colorwayById, site, type Colorway, type ColorwayId } from "@/config/site";

type ColorwayContext = {
  colorway: Colorway;
  setColorway: (id: ColorwayId) => void;
};

const Context = createContext<ColorwayContext | null>(null);

/** The selected colorway is page-wide: swatches, images and the 3D pieces all follow it. */
export function ColorwayProvider({ children }: { children: ReactNode }) {
  const [id, setColorway] = useState<ColorwayId>(site.defaultColorway);
  const value = useMemo(() => ({ colorway: colorwayById(id), setColorway }), [id]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useColorway(): ColorwayContext {
  const value = useContext(Context);
  if (!value) throw new Error("useColorway must be used inside <ColorwayProvider>");
  return value;
}
