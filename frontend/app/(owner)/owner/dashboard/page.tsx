"use client";

import * as React from "react";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tractor, DollarSign, CalendarDays, CheckCircle2, 
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight, 
  MapPin, Phone, User
} from "lucide-react";
import { motion } from "framer-motion";

export default function OwnerDashboardPage() {
  const [bookings, setBookings] = React.useState([
    { id: 1, farmer: "Ramesh Patel", machine: "John Deere 5050D", date: "Oct 12 - Oct 15", rate: "₹3,200/day", total: "₹9,600", status: "pending", location: "Pune, MH", contact: "+91 98765 43210" },
    { id: 2, farmer: "Suresh Deshmukh", machine: "Mahindra Arjun 555", date: "Oct 16 - Oct 18", rate: "₹2,800/day", total: "₹5,600", status: "pending", location: "Nagpur, MH", contact: "+91 98765 12345" },
    { id: 3, farmer: "Amit Shinde", machine: "Rotavator Heavy Duty", date: "Oct 14 - Oct 14", rate: "₹1,500/day", total: "₹1,500", status: "confirmed", location: "Jalgaon, MH", contact: "+91 99988 77766" },
  ]);

  const handleAccept = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
  };

  const handleReject = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
  };

  const pendingBookings = bookings.filter(b => b.status === "pending");

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Partner Control Panel
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Machinery Partner Dashboard
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Machines</span>
              <span className="text-2xl font-black text-foreground">4 <span className="text-xs font-normal text-muted-foreground">/ 5 total</span></span>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-btn flex items-center justify-center text-primary">
              <Tractor className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Bookings</span>
              <span className="text-2xl font-black text-foreground">18 <span className="text-xs font-normal text-muted-foreground">this month</span></span>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 rounded-btn flex items-center justify-center text-emerald-600">
              <CalendarDays className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Monthly Revenue</span>
              <span className="text-2xl font-black text-foreground">₹48,200</span>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-btn flex items-center justify-center text-amber-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </Card>

          {/* Card 4 */}
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Pending Requests</span>
              <span className="text-2xl font-black text-foreground">{pendingBookings.length} <span className="text-xs font-normal text-muted-foreground">action items</span></span>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-btn flex items-center justify-center text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Requests */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Pending Booking Requests</h3>
                <Badge variant="success" className="text-[9px] px-1.5 py-0.5">Live Alert Feed</Badge>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 text-primary/45 mx-auto mb-2.5" />
                  All booking requests processed successfully.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {pendingBookings.map(bk => (
                    <div key={bk.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{bk.farmer}</span>
                          <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {bk.location}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Machine: <span className="font-semibold text-foreground">{bk.machine}</span></p>
                          <p>Duration: <span className="font-semibold text-foreground">{bk.date}</span> ({bk.rate})</p>
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {bk.contact}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0">
                        <span className="text-sm font-black text-primary">{bk.total}</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleReject(bk.id)}
                            className="text-[10px] font-bold h-7.5 px-2.5 rounded-btn bg-card text-rose-500 border border-rose-500/20 hover:bg-rose-500/5 cursor-pointer"
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleAccept(bk.id)}
                            className="text-[10px] font-bold h-7.5 px-2.5 rounded-btn cursor-pointer"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Performance chart representation */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-base font-bold text-foreground">Weekly Revenue Tracker</h3>
                <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +12.4%
                </span>
              </div>
              <div className="h-44 flex items-end justify-between gap-1.5 pt-4">
                {[
                  { day: "Mon", val: 30 },
                  { day: "Tue", val: 50 },
                  { day: "Wed", val: 80 },
                  { day: "Thu", val: 65 },
                  { day: "Fri", val: 95 },
                  { day: "Sat", val: 40 },
                  { day: "Sun", val: 70 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/10 rounded-t-btn relative group h-32 flex items-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.val}%` }}
                        transition={{ delay: idx * 0.05, duration: 0.8 }}
                        className="w-full bg-primary rounded-t-btn relative"
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-bold">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
}
