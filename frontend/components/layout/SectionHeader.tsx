import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  className,
  title,
  description,
  action,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
