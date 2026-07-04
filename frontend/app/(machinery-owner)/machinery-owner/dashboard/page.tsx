"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tractor, DollarSign, CalendarDays, CheckCircle2, 
  Clock, ArrowUpRight, ShieldCheck, MapPin, User, Activity 
} from "lucide-react";
import { motion } from "framer-motion";

export default function MachineryOwnerDashboard() {
  const [machinesAvailability, setMachinesAvailability] = React.useState([
    { name: "John Deere 5050D", type: "Tractor", location: "Pune Hub", status: "Available" },
    { name: "Mahindra Arjun 555", type: "Tractor", location: "Nagpur Hub", status: "Rented" },
    { name: "Rotavator Heavy Duty", type: "Cultivator", location: "Jalgaon Hub", status: "Available" },
  ]);

  const recentActivity = [
    { id: 1, action: "Booking Confirmed", desc: "John Deere booked by Ramesh Patel.", time: "10 mins ago" },
    { id: 2, action: "Machine Added", desc: "Rotavator Heavy Duty registered successfully.", time: "2 hours ago" },
    { id: 3, action: "Payout Settled", desc: "₹9,600 transferred to account ending in 8493.", time: "Yesterday" },
  ];

  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Fleet Operations Control
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Machinery Dashboard
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1: Total Machines */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Total Machines</span>
              <span className="text-xl font-black text-foreground">3</span>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <Tractor className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 2: Active Rentals */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Active Rentals</span>
              <span className="text-xl font-black text-foreground">1</span>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-btn flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 3: Today's Bookings */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Today&apos;s Bookings</span>
              <span className="text-xl font-black text-foreground">2</span>
            </div>
            <div className="h-10 w-10 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <CalendarDays className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 4: Monthly Earnings */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Monthly Earnings</span>
              <span className="text-xl font-black text-foreground">₹48,200</span>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
          </Card>

          {/* Card 5: Pending Requests */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Pending Requests</span>
              <span className="text-xl font-black text-foreground">2</span>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 rounded-btn flex items-center justify-center text-rose-600">
              <Clock className="h-5.5 w-5.5" />
            </div>
          </Card>
        </div>

        {/* Middle content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Chart Card */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Earnings Chart (Weekly Tracker)</h3>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +14.5%
                </span>
              </div>

              {/* Chart mockup */}
              <div className="h-44 flex items-end justify-between gap-1.5 pt-4">
                {[
                  { day: "Mon", val: 30 },
                  { day: "Tue", val: 50 },
                  { day: "Wed", val: 80 },
                  { day: "Thu", val: 60 },
                  { day: "Fri", val: 95 },
                  { day: "Sat", val: 40 },
                  { day: "Sun", val: 70 }
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
                    <span className="text-[9px] text-muted-foreground font-bold">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Booking Calendar Mock */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Booking Calendar Preview</h3>
                <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0">October</Badge>
              </div>

              {/* Mini Calendar block */}
              <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-bold text-muted-foreground uppercase mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, idx) => {
                  const day = idx - 2;
                  const isPast = day < 1;
                  const isBooked = day === 12 || day === 13 || day === 14;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square rounded-card border flex items-center justify-center text-[9px] font-bold",
                        isPast ? "bg-muted/5 border-transparent text-muted-foreground/30" :
                        isBooked ? "bg-rose-500/10 border-rose-500/20 text-rose-600" :
                        "bg-emerald-500/5 border-emerald-500/20 text-emerald-600"
                      )}
                    >
                      {day > 0 && day <= 31 ? day : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Machine Availability status list */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Machine Availability Status</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">Real-time status</Badge>
            </div>
            <div className="divide-y divide-border/40">
              {machinesAvailability.map((mac, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">{mac.name}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {mac.location} ({mac.type})
                    </span>
                  </div>
                  <Badge variant={mac.status === "Available" ? "success" : "outline"} className="text-[8.5px] font-bold px-2 py-0.5">
                    {mac.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity feed */}
          <Card className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
              <h3 className="text-base font-bold text-foreground">Recent Activity Log</h3>
              <Badge variant="outline" className="text-[8.5px] font-bold">System log</Badge>
            </div>
            <div className="divide-y divide-border/40">
              {recentActivity.map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-start text-xs gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">{act.action}</span>
                    <span className="text-muted-foreground block">{act.desc}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{act.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MachineryOwnerLayout>
  );
}
