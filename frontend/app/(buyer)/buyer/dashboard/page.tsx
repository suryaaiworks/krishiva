"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Users, Package, RefreshCw, Star, 
  MapPin, TrendingUp, Sparkles, ArrowUpRight, 
  CheckSquare, Activity, Bell 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BuyerDashboard() {
  const router = useRouter();

  const recentNotifications = [
    { id: 1, text: "Counter Offer Received from Ramesh Patel.", time: "12m ago" },
    { id: 2, text: "Direct Crop Match: 15 Tons Wheat available.", time: "1 hour ago" },
    { id: 3, text: "Payment of ₹49,500 settled successfully.", time: "3 hours ago" },
  ];

  const recentContracts = [
    { id: "CON9203", seller: "Ramesh Patel", crop: "Sugarcane", qty: "15 Tons", status: "Active" },
    { id: "CON9202", seller: "Suresh Deshmukh", crop: "Wheat", qty: "8 Tons", status: "Completed" },
  ];

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Procurement Console
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Buyer Dashboard
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Active Purchase Requests */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Active Requests</span>
              <span className="text-xl font-black text-foreground">3</span>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <ShoppingCart className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 2: Today's Orders */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Today&apos;s Orders</span>
              <span className="text-xl font-black text-foreground">1</span>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-btn flex items-center justify-center text-emerald-600">
              <Package className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 3: Connected Farmers */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Farmers Connected</span>
              <span className="text-xl font-black text-foreground">12</span>
            </div>
            <div className="h-10 w-10 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <Users className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 4: Pending Negotiations */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Pending Negotiations</span>
              <span className="text-xl font-black text-foreground">2</span>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <RefreshCw className="h-5.5 w-5.5" />
            </div>
          </Card>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Analytics (Bar Graph Mockup) */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Spending Analytics</h3>
                <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0">YTD</Badge>
              </div>

              {/* Chart mockup */}
              <div className="h-44 flex items-end justify-between gap-1.5 pt-4">
                {[
                  { label: "Sugarcane", val: 80 },
                  { label: "Wheat", val: 50 },
                  { label: "Cotton", val: 35 },
                  { label: "Paddy", val: 65 },
                  { label: "Banana", val: 20 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/10 rounded-t-btn h-32 flex items-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.val}%` }}
                        transition={{ delay: idx * 0.05, duration: 0.8 }}
                        className="w-full bg-primary rounded-t-btn"
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-bold truncate max-w-[56px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Market Trend Graph (Line Graph Mockup) */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Market Trend Graph</h3>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +12.4%
                </span>
              </div>
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-btn text-xs space-y-2">
                <span className="font-bold text-foreground block">Spot Market Index</span>
                <p className="text-muted-foreground leading-relaxed">
                  Sugarcane procurement demands reached index high of 145 points. Pricing expected to level in November.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contracts */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Recent Contracts</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Encrypted</Badge>
            </div>
            <div className="divide-y divide-border/40">
              {recentContracts.map((con, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">Contract #{con.id}</span>
                    <span className="text-[10px] text-muted-foreground">
                      Seller: {con.seller} | Crop: {con.crop} ({con.qty})
                    </span>
                  </div>
                  <Badge variant={con.status === "Active" ? "success" : "outline"} className="text-[8.5px] font-bold px-2 py-0.5">
                    {con.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Notifications */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Recent Notifications</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">System Alerts</Badge>
            </div>
            <div className="divide-y divide-border/40">
              {recentNotifications.map((notif) => (
                <div key={notif.id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-start text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block">{notif.text}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{notif.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
