"use client";

import * as React from "react";
import { Sprout, Droplet, Sun, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CropCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cropName: string;
  category: string;
  matchPercentage: number;
  soilType: string;
  waterRequirement: string;
  season: string;
  onSelect?: () => void;
  animate?: boolean;
}

export function CropCard({
  className,
  cropName,
  category,
  matchPercentage,
  soilType,
  waterRequirement,
  season,
  onSelect,
  animate = true,
  ...props
}: CropCardProps) {
  return (
    <Card
      title=""
      animate={animate}
      className={cn("p-5 overflow-hidden", className)}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">{category}</p>
          <h3 className="text-xl font-bold text-foreground">{cropName}</h3>
        </div>
        <Badge
          variant={matchPercentage >= 90 ? "success" : matchPercentage >= 75 ? "warning" : "secondary"}
          className="text-xs px-2.5 py-0.5 font-bold"
        >
          {matchPercentage}% Match
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-border/50 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Landmark className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Soil</span>
          </div>
          <p className="font-bold text-foreground truncate mt-0.5">{soilType}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplet className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Water</span>
          </div>
          <p className="font-bold text-foreground truncate mt-0.5">{waterRequirement}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sun className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Season</span>
          </div>
          <p className="font-bold text-foreground truncate mt-0.5">{season}</p>
        </div>
      </div>

      {onSelect && (
        <div className="mt-4">
          <Button
            onClick={onSelect}
            className="w-full justify-center text-xs h-9 rounded-btn font-bold cursor-pointer"
            variant="outline"
          >
            <Sprout className="mr-1.5 h-4 w-4" />
            Growth Advisor Plan
          </Button>
        </div>
      )}
    </Card>
  );
}
