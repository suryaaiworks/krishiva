"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ShieldCheck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketInsightsPage() {
  const topCrops = [
    { name: "Sugarcane", percentage: "55%", value: "₹49,500" },
    { name: "Wheat (Lokwan)", percentage: "30%", value: "₹20,800" },
    { name: "Organic Bananas", percentage: "15%", value: "₹72,000" },
  ];

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Procurement Intelligence
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Market Insights & Procurement Reports
          </h2>
        </div>

        {/* Info widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Top Sourced Crop</span>
              <span className="text-base font-extrabold text-foreground">Sugarcane (Grade A)</span>
              <span className="text-[9px] text-primary font-bold block flex items-center gap-0.5 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Direct Match Match Rate: 98%
              </span>
            </div>
            <div className="h-11 w-11 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <TrendingUp className="h-5.5 w-5.5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Avg Procurement Price</span>
              <span className="text-xl font-black text-foreground">₹24,500 / Ton</span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Stabilized rates since Oct 01
              </span>
            </div>
            <div className="h-11 w-11 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Procurement Volume</span>
              <span className="text-xl font-black text-foreground">27 Tons</span>
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                Targeting 50 Tons this season
              </span>
            </div>
            <div className="h-11 w-11 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <BarChart3 className="h-5.5 w-5.5" />
            </div>
          </Card>
        </div>

        {/* Main analytics panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Procurement volume index chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Monthly Procurement Trends</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Volume / Month</Badge>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-3 pt-6 max-w-xl mx-auto text-xs">
              {[
                { label: "May", val: "8T", ht: "30%" },
                { label: "Jun", val: "12T", ht: "45%" },
                { label: "Jul", val: "22T", ht: "75%" },
                { label: "Aug", val: "18T", ht: "60%" },
                { label: "Sep", val: "27T", ht: "95%" }
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

          {/* Top Crops Sourced list */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Top Sourced Crops</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Total share</Badge>
            </div>
            <div className="space-y-4 pt-2">
              {topCrops.map((c, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{c.name}</span>
                    <span>{c.percentage}</span>
                  </div>
                  <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: c.percentage }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground block text-right font-medium">{c.value} paid</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
