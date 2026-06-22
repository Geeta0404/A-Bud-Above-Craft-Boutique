"use client";

import { Palette as PaletteIcon, Check } from "lucide-react";
import { usePalette } from "@/context/PaletteContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function PaletteSwitcher() {
  const { palette, setPaletteId, palettes } = usePalette();
  const light = palettes.filter((p) => p.mode === "light");
  const dark = palettes.filter((p) => p.mode === "dark");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Choose color palette"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-foreground/10 transition-transform hover:scale-105"
        >
          <PaletteIcon className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Color Palette</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-6">
          <PaletteGroup
            title="Light themes"
            options={light}
            activeId={palette.id}
            onSelect={setPaletteId}
          />
          <PaletteGroup
            title="Dark themes"
            options={dark}
            activeId={palette.id}
            onSelect={setPaletteId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PaletteGroup({
  title,
  options,
  activeId,
  onSelect,
}: {
  title: string;
  options: ReturnType<typeof usePalette>["palettes"];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors hover:border-primary/50",
              activeId === p.id ? "border-primary ring-1 ring-primary" : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex overflow-hidden rounded-full ring-1 ring-foreground/10">
                {p.swatch.map((color, i) => (
                  <span key={i} className="h-5 w-5" style={{ backgroundColor: color }} />
                ))}
              </div>
              {activeId === p.id && <Check className="h-4 w-4 text-primary" />}
            </div>
            <span className="text-sm font-medium">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
