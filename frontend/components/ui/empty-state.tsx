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
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-card bg-card/50 max-w-md mx-auto",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {actionNode ? (
        actionNode
      ) : (
        actionText &&
        onActionClick && (
          <Button onClick={onActionClick} variant="default">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
}
