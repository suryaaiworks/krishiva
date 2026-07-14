import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onActionClick?: () => void;
  actionNode?: React.ReactNode;
}

export function EmptyState({
  className,
  title,
  description,
  icon: Icon,
  actionText,
  onActionClick,
  actionNode,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/80 rounded-card bg-card/60 max-w-md mx-auto shadow-sm backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20 shadow-inner">
        {/* Concentric ambient ring */}
        <span className="absolute -inset-1.5 rounded-full bg-primary/5 border border-primary/10 animate-pulse pointer-events-none" />
        <Icon className="h-7 w-7 relative z-10" />
      </div>
      <h3 className="font-heading text-sm font-extrabold text-foreground mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-[11.5px] text-muted-foreground mb-5 leading-normal max-w-xs font-semibold">
        {description}
      </p>
      {actionNode ? (
        actionNode
      ) : (
        actionText &&
        onActionClick && (
          <Button onClick={onActionClick} variant="default" className="text-xs h-9 rounded-btn font-bold px-4 cursor-pointer">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
}

