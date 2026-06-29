"use client";

import * as React from "react";
import { User, MapPin, Landmark, Trees } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  cropsGrown: string[];
  soilType: string;
  avatarUrl?: string;
  onEditClick?: () => void;
  animate?: boolean;
}

export function ProfileCard({
  className,
  name,
  phone,
  location,
  farmSize,
  cropsGrown,
  soilType,
  avatarUrl,
  onEditClick,
  animate = true,
  ...props
}: ProfileCardProps) {
  const nameInitials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card
      title=""
      animate={animate}
      className={cn("p-6 overflow-hidden", className)}
      {...props}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-5 border-b border-border/50">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {nameInitials || <User />}
          </AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{phone}</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {location}
          </p>
        </div>

        {onEditClick && (
          <Button
            onClick={onEditClick}
            variant="outline"
            className="sm:ml-auto text-xs font-bold rounded-btn cursor-pointer"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-5 text-center sm:text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Farm Size
          </span>
          <p className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Trees className="h-4 w-4 text-primary shrink-0" />
            {farmSize}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Soil Type
          </span>
          <p className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Landmark className="h-4 w-4 text-primary shrink-0" />
            {soilType}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Active Crops
          </span>
          <p className="text-sm font-bold text-foreground truncate" title={cropsGrown.join(", ")}>
            {cropsGrown.join(", ")}
          </p>
        </div>
      </div>
    </Card>
  );
}
