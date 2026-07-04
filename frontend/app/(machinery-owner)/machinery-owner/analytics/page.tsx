"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Star, ArrowUpRight, Tractor, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const popularMachines = [
    { name: "John Deere 5050D", share: "55%", rentals: 12 },
    { name: "Mahindra Arjun 555", share: "30%", rentals: 6 },
    { name: "Rotavator Heavy Duty", share: "15%", rentals: 3 },
  ];

  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Business Intelligence
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Fleet Analytics & Trends
          </h2>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Popular Machine */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Most Popular Machine</span>
              <span className="text-base font-extrabold text-foreground">John Deere 5050D</span>
              <span className="text-[9px] text-primary font-bold block flex items-center gap-0.5 mt-0.5">
                <Sparkles className="h-3.5 w-3.5" /> 55% share of total demand
              </span>
            </div>
            <div className="h-11 w-11 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <Tractor className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Average Rating */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Customer Rating Index</span>
              <span className="text-xl font-black text-foreground">4.8 / 5</span>
              <span className="text-[9px] text-emerald-600 font-bold block flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" /> +0.2 this month
              </span>
            </div>
            <div className="h-11 w-11 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-500">
              <Star className="h-5.5 w-5.5 fill-current" />
            </div>
          </Card>

          {/* Sourcing matched */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Utilization rate</span>
              <span className="text-xl font-black text-foreground">78%</span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Optimal dispatch metrics
              </span>
            </div>
            <div className="h-11 w-11 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <BarChart3 className="h-5.5 w-5.5" />
            </div>
          </Card>
        </div>

        {/* Charts and distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Sourcing Volume chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Booking Trends (6-Month Scale)</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Volume / Month</Badge>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-3 pt-6 max-w-xl mx-auto text-xs">
              {[
                { label: "May", val: "₹18k", ht: "30%" },
                { label: "Jun", val: "₹24k", ht: "45%" },
                { label: "Jul", val: "₹42k", ht: "75%" },
                { label: "Aug", val: "₹38k", ht: "65%" },
                { label: "Sep", val: "₹52k", ht: "95%" }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-foreground">{item.val}</span>
                  <div className="w-12 bg-primary/10 rounded-t-btn h-32 flex items-end justify-center">
                    <div 
                      className="w-full bg-primary rounded-t-btn transition-all duration-500"
                      style={{ height: item.ht }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Machine Shares */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Fleet Share</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Demand index</Badge>
            </div>
            <div className="space-y-4 pt-2">
              {popularMachines.map((m, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{m.name}</span>
                    <span>{m.share}</span>
                  </div>
                  <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: m.share }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MachineryOwnerLayout>
  );
}
