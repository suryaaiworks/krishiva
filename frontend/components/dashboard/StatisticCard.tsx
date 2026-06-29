"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  animate?: boolean;
}

export function StatisticCard({
  className,
  label,
  value,
  icon: Icon,
  iconClassName,
  trend,
  trendType = "neutral",
  animate = true,
  ...props
}: StatisticCardProps) {
  return (
    <Card
      title=""
      animate={animate}
      className={cn("p-5 overflow-hidden", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
          {label}
        </span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-btn bg-muted text-muted-foreground",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {trend && (
          <Badge
            variant={
              trendType === "positive"
                ? "success"
                : trendType === "negative"
                ? "destructive"
                : "secondary"
            }
            className="text-[10px] font-bold px-2 py-0"
          >
            {trend}
          </Badge>
        )}
      </div>
    </Card>
  );
}
