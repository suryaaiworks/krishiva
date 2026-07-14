"use client";

import * as React from "react";
import { GuestLayout } from "@/components/layout/GuestLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, Tractor, Users, Activity, Sparkles, 
  ArrowRight, ShieldAlert, BarChart3 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function GuestDashboardPage() {
  const router = useRouter();

  return (
    <GuestLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Guest Preview
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Limited Guest Dashboard
          </h2>
        </div>

        {/* Info alert */}
        <Card className="p-4 bg-amber-500/5 border border-amber-500/10 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-foreground block">Guest Account Restrictions</span>
            <p className="leading-relaxed">
              You are currently viewing Krishiva in Preview mode. Real-time B2B trade posting, machinery rentals, plant disease diagnostic cameras, and Vira AI Advisor require a verified account registration.
            </p>
            <div className="pt-2">
              <Button 
                onClick={() => router.push("/login")}
                size="sm"
                className="text-[10px] font-bold h-7.5 px-3 rounded-btn cursor-pointer"
              >
                Sign Up / Register Account <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Registered Farmers</span>
              <span className="text-2xl font-black text-foreground">1,240+</span>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Verified B2B Buyers</span>
              <span className="text-2xl font-black text-foreground">84</span>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-btn flex items-center justify-center text-emerald-600">
              <Building className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Available Machinery</span>
              <span className="text-2xl font-black text-foreground">320+</span>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <Tractor className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Direct Trade Volume</span>
              <span className="text-2xl font-black text-foreground">₹24.8L+</span>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* B2B match preview chart */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-base font-bold text-foreground">Crop Sourcing Trade Activity Index</h3>
            </div>
            <Badge variant="success" className="text-[8px] font-bold">Historical data</Badge>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 max-w-2xl mx-auto">
            {[
              { month: "May", vol: "₹4.2L", height: "40%" },
              { month: "Jun", vol: "₹6.8L", height: "55%" },
              { month: "Jul", vol: "₹12.4L", height: "80%" },
              { month: "Aug", vol: "₹9.1L", height: "65%" },
              { month: "Sep", vol: "₹15.8L", height: "95%" }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] font-bold text-foreground">{item.vol}</div>
                <div className="w-12 bg-primary/10 rounded-t-btn relative h-32 flex items-end justify-center">
                  <div 
                    className="w-full bg-primary rounded-t-btn transition-all duration-500" 
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">{item.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </GuestLayout>
  );
}
