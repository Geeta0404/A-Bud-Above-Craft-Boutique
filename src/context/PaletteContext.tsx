"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { palettes, defaultPaletteId, type Palette } from "@/lib/palettes";

type PaletteContextValue = {
  palette: Palette;
  setPaletteId: (id: string) => void;
  palettes: Palette[];
};

const PaletteContext = createContext<PaletteContextValue | null>(null);
const STORAGE_KEY = "aba-palette";

function applyPalette(palette: Palette) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette.colors)) {
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  }
  root.classList.toggle("dark", palette.mode === "dark");
}

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteId] = useState(defaultPaletteId);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && palettes.some((p) => p.id === stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
        setPaletteId(stored);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    const palette = palettes.find((p) => p.id === paletteId) ?? palettes[0];
    applyPalette(palette);
    try {
      localStorage.setItem(STORAGE_KEY, paletteId);
    } catch {
      // ignore write failures (private browsing, etc.)
    }
  }, [paletteId]);

  const value = useMemo<PaletteContextValue>(
    () => ({
      palette: palettes.find((p) => p.id === paletteId) ?? palettes[0],
      setPaletteId,
      palettes,
    }),
    [paletteId]
  );

  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within a PaletteProvider");
  return ctx;
}
