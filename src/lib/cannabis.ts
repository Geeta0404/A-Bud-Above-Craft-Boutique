import type { Product, StrainType } from "@/lib/types";

export const EFFECTS_OPTIONS = [
  "Calm",
  "Happy",
  "Relaxed",
  "Energetic",
  "Sleepy",
  "Creative",
  "Focused",
  "Inspired",
] as const;

const STRAIN_EFFECTS: Record<StrainType, string[]> = {
  Sativa: ["Energetic", "Happy", "Creative", "Focused"],
  Indica: ["Relaxed", "Calm", "Sleepy"],
  Hybrid: ["Happy", "Relaxed", "Creative", "Inspired"],
  Blend: ["Calm", "Relaxed", "Focused"],
};

export function getEffects(product: Product): string[] {
  return STRAIN_EFFECTS[product.strainType] ?? [];
}

function formatRange(min: number, max: number, unit: string) {
  return min === max ? `${min}${unit}` : `${min}-${max}${unit}`;
}

export function formatThc(product: Product) {
  return `THC ${formatRange(product.thcMin, product.thcMax, product.thcUnit)}`;
}

export function formatCbd(product: Product) {
  return `CBD ${formatRange(product.cbdMin, product.cbdMax, product.cbdUnit)}`;
}

export function hasPotencyInfo(product: Product) {
  return product.thcMax > 0 || product.cbdMax > 0;
}
