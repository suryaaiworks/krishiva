"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MarketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cropName: string;
  price: string;
  marketName: string;
  priceChange: string;
  trend: "up" | "down" | "stable";
  onDetailsClick?: () => void;
  animate?: boolean;
}

export function MarketCard({
  className,
  cropName,
  price,
  marketName,
  priceChange,
  trend,
  onDetailsClick,
  animate = true,
  ...props
}: MarketCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : TrendingUp;
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <Card
      title=""
      animate={animate}
      className={cn("p-5 overflow-hidden", className)}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">{cropName}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" />
            {marketName}
          </p>
        </div>
        <Badge
          variant={isUp ? "success" : isDown ? "destructive" : "secondary"}
          className="text-xs px-2 py-0.5 font-bold flex items-center gap-1"
        >
          <TrendIcon className="h-3 w-3" />
          {priceChange}
        </Badge>
      </div>

      <div className="mt-5 flex justify-between items-baseline">
        <div className="space-y-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {price}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            per quintal
          </span>
        </div>

        {onDetailsClick && (
          <Button
            onClick={onDetailsClick}
            variant="ghost"
            className="text-xs font-bold text-primary hover:bg-primary/10 cursor-pointer"
          >
            Price Trends
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
