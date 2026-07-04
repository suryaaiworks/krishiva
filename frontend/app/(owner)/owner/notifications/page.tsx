"use client";

import * as React from "react";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Tractor, DollarSign, AlertCircle, Info } from "lucide-react";

export default function OwnerNotificationsPage() {
  const [filter, setFilter] = React.useState<"all" | "booking" | "payment" | "system">("all");

  const notifications = [
    { id: 1, type: "booking", title: "New Booking Request", desc: "Ramesh Patel requested John Deere 5050D for 3 days starting Oct 12.", time: "10 minutes ago", icon: Tractor, color: "text-primary bg-primary/10" },
    { id: 2, type: "payment", title: "Payout Settled Successfully", desc: "₹9,600 has been credited to your bank account for Transaction TXN10293.", time: "2 hours ago", icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
    { id: 3, type: "booking", title: "Booking Confirmed", desc: "Your Rotavator booking for Amit Shinde on Oct 14 has been confirmed.", time: "Yesterday", icon: Tractor, color: "text-primary bg-primary/10" },
    { id: 4, type: "system", title: "System Maintenance Scheduled", desc: "Krishiva partner portal will undergo brief maintenance on Oct 10 from 02:00 to 03:00 AM IST.", time: "3 days ago", icon: AlertCircle, color: "text-amber-600 bg-amber-500/10" },
  ];

  const filteredNotifs = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Updates Log
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Partner Notifications
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          {([
            { id: "all", label: "All Alerts" },
            { id: "booking", label: "Bookings" },
            { id: "payment", label: "Payments" },
            { id: "system", label: "System Updates" }
          ] as const).map((chip) => {
            const isSelected = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`px-3 py-1.5 text-[10.5px] font-bold rounded-btn transition-all cursor-pointer border ${
                  isSelected 
                    ? "bg-primary text-white border-primary" 
                    : "bg-card text-muted-foreground hover:bg-muted/10 border-border"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Alerts feed list */}
        <div className="space-y-3.5">
          {filteredNotifs.length === 0 ? (
            <Card className="p-12 text-center text-xs text-muted-foreground">
              <Bell className="h-8 w-8 text-primary/45 mx-auto mb-2.5" />
              No notifications found.
            </Card>
          ) : (
            filteredNotifs.map((notif) => {
              const Icon = notif.icon;
              return (
                <Card key={notif.id} className="p-4 flex items-start gap-4 hover:bg-muted/5 transition-colors">
                  <div className={`h-10 w-10 rounded-btn shrink-0 flex items-center justify-center ${notif.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex justify-between items-start gap-3">
                      <span className="font-bold text-foreground block text-[13px]">{notif.title}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{notif.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {notif.desc}
                    </p>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
