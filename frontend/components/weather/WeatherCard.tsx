"use client";

import * as React from "react";
import { CloudRain, Sun, Wind, Droplets, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface WeatherCardProps extends React.HTMLAttributes<HTMLDivElement> {
  temperature: string;
  condition: string;
  location: string;
  humidity: string;
  windSpeed: string;
  rainProbability: string;
  alertMessage?: string;
  animate?: boolean;
}

export function WeatherCard({
  className,
  temperature,
  condition,
  location,
  humidity,
  windSpeed,
  rainProbability,
  alertMessage,
  animate = true,
  ...props
}: WeatherCardProps) {
  const isRainy = condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("shower") || condition.toLowerCase().includes("drizzle");
  const WeatherIcon = isRainy ? CloudRain : Sun;

  return (
    <Card
      title=""
      animate={animate}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 p-6 border-transparent dark:border-border dark:from-card dark:to-card",
        className
      )}
      {...props}
    >
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{location}</p>
          <h3 className="text-4xl font-extrabold tracking-tight text-foreground">{temperature}</h3>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-1.5">
            <WeatherIcon className="h-4 w-4 text-primary" />
            {condition}
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-btn bg-background/80 shadow-sm border border-border/50 text-primary">
          <WeatherIcon className="h-8 w-8" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5 text-primary" />
            <span>Humidity</span>
          </div>
          <p className="text-sm font-bold text-foreground">{humidity}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wind className="h-3.5 w-3.5 text-primary" />
            <span>Wind</span>
          </div>
          <p className="text-sm font-bold text-foreground">{windSpeed}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CloudRain className="h-3.5 w-3.5 text-primary" />
            <span>Precipitation</span>
          </div>
          <p className="text-sm font-bold text-foreground">{rainProbability}</p>
        </div>
      </div>

      {alertMessage && (
        <div className="mt-5 rounded-btn bg-warning/10 border border-warning/20 p-3 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <span className="text-xs font-semibold text-warning-foreground leading-relaxed">
            {alertMessage}
          </span>
        </div>
      )}
    </Card>
  );
}
