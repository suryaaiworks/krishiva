"use client";

import * as React from "react";
import { AlertTriangle, Info, ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AlertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  date: string;
  onActionClick?: () => void;
  actionText?: string;
  animate?: boolean;
}

export function AlertCard({
  className,
  title,
  message,
  severity,
  date,
  onActionClick,
  actionText = "Protection Steps",
  animate = true,
  ...props
}: AlertCardProps) {
  const config = {
    info: {
      border: "border-l-blue-500",
      bg: "bg-blue-50/50 dark:bg-blue-950/10",
      text: "text-blue-600 dark:text-blue-400",
      icon: Info,
    },
    warning: {
      border: "border-l-warning",
      bg: "bg-warning/5 dark:bg-warning/10",
      text: "text-warning",
      icon: AlertTriangle,
    },
    critical: {
      border: "border-l-destructive",
      bg: "bg-destructive/5 dark:bg-destructive/10",
      text: "text-destructive",
      icon: ShieldAlert,
    },
  };

  const current = config[severity] || config.info;
  const SeverityIcon = current.icon;

  return (
    <Card
      title=""
      animate={animate}
      className={cn(
        "border-l-4 p-5 shadow-sm overflow-hidden border-t-0 border-r-0 border-b-0",
        current.border,
        current.bg,
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-background shadow-sm border border-border/50", current.text)}>
          <SeverityIcon className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-heading text-sm font-bold text-foreground">
              {title}
            </h4>
            <span className="text-[10px] text-muted-foreground shrink-0">{date}</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {message}
          </p>

          {onActionClick && (
            <div className="pt-1.5">
              <Button
                onClick={onActionClick}
                variant="ghost"
                className={cn("text-xs font-bold p-0 h-auto hover:bg-transparent flex items-center gap-1 cursor-pointer", current.text)}
              >
                {actionText}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
