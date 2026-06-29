"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Chip({
  className,
  children,
  selected = false,
  onRemove,
  icon,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground select-none focus:outline-none focus:ring-2 focus:ring-primary/50",
        selected && "border-primary bg-primary/10 text-primary hover:bg-primary/20",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="flex-shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
