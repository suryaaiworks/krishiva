"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}

export function SearchBar({
  className,
  onFilterClick,
  showFilterButton = false,
  ...props
}: SearchBarProps) {
  return (
    <div className={cn("relative flex w-full items-center gap-2.5", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          className="h-12 w-full rounded-input border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
          {...props}
        />
      </div>
      {showFilterButton && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-12 w-12 items-center justify-center rounded-btn border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 cursor-pointer"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
