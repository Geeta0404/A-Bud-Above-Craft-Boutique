"use client";

import { LayoutGrid, List as ListIcon, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type ViewMode = "list" | "grid";

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const Icon = value === "list" ? ListIcon : LayoutGrid;
  const label = value === "list" ? "List" : "Cards";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" aria-label="Change product view">
          <Icon className="h-4 w-4" />
          {label}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onChange("list")}>
          <ListIcon className="h-4 w-4" /> List
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("grid")}>
          <LayoutGrid className="h-4 w-4" /> Cards
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
