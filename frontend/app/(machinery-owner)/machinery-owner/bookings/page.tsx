"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, Clock, Phone, MapPin, Tractor, XCircle, 
  CalendarRange, ChevronRight 
} from "lucide-react";

type BookingStatus = "pending" | "accepted" | "completed" | "rejected";

export default function BookingRequestsPage() {
  const [bookings, setBookings] = React.useState([
    { id: 1, farmer: "Ramesh Patel", machine: "John Deere 5050D", date: "Oct 12 - Oct 15", rate: "₹3,200/day", total: "₹9,600", status: "pending" as BookingStatus, location: "Pune, MH", contact: "+91 98765 43210", crop: "Sugarcane" },
    { id: 2, farmer: "Suresh Deshmukh", machine: "Mahindra Arjun 555", date: "Oct 16 - Oct 18", rate: "₹2,800/day", total: "₹5,600", status: "pending" as BookingStatus, location: "Nagpur, MH", contact: "+91 98765 12345", crop: "Cotton" },
    { id: 3, farmer: "Amit Shinde", machine: "Rotavator Heavy Duty", date: "Oct 14 - Oct 14", rate: "₹1,500/day", total: "₹1,500", status: "accepted" as BookingStatus, location: "Jalgaon, MH", contact: "+91 99988 77766", crop: "Banana" },
  ]);

  const handleUpdateStatus = (id: number, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 text-[8.5px] font-bold">Pending</Badge>;
      case "accepted":
        return <Badge variant="success" className="text-[8.5px] font-bold">Accepted</Badge>;
      case "completed":
        return <Badge variant="success" className="bg-blue-500/5 text-blue-600 border-blue-500/20 text-[8.5px] font-bold">Completed</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-rose-500/5 text-rose-600 border-rose-500/20 text-[8.5px] font-bold">Rejected</Badge>;
    }
  };

  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Rental Records
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Booking & Rental Requests
          </h2>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((bk) => (
            <Card key={bk.id} className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-sm transition-shadow">
              {/* Farmer Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{bk.farmer}</span>
                  {getStatusBadge(bk.status)}
                  <Badge variant="outline" className="text-[8.5px] font-bold px-1.5 py-0">Crop: {bk.crop}</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-1.5">
                    <Tractor className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>Machine: <span className="font-bold text-foreground">{bk.machine}</span></span>
                  </div>
                  <div className="relative flex items-center gap-1.5">
                    <CalendarRange className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>Rental Dates: <span className="font-bold text-foreground">{bk.date}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>Location: <span className="font-bold text-foreground">{bk.location}</span></span>
                  </div>
                </div>

                {/* Booking Timeline Mock */}
                <div className="pt-2 flex items-center gap-2.5 text-[9.5px] font-bold text-muted-foreground uppercase select-none">
                  <span>Requested</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className={cn(bk.status !== "pending" && "text-primary")}>Accepted</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className={cn(bk.status === "completed" && "text-primary")}>Dispatched</span>
                </div>
              </div>

              {/* Pricing & Accept/Reject actions */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/30">
                <div className="text-left lg:text-right">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Total Payout</span>
                  <span className="text-base font-black text-primary">{bk.total}</span>
                </div>

                {bk.status === "pending" ? (
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(bk.id, "rejected")}
                      className="text-[10px] font-bold h-8 px-3 rounded-btn bg-card text-rose-500 border border-rose-500/20 hover:bg-rose-500/5 cursor-pointer"
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(bk.id, "accepted")}
                      className="text-[10px] font-bold h-8 px-3 rounded-btn cursor-pointer"
                    >
                      Accept
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => alert(`Calling Farmer ${bk.farmer} at ${bk.contact}...`)}
                    className="text-[10px] font-bold h-8 px-3 rounded-btn cursor-pointer flex items-center gap-1 bg-card hover:bg-muted/10 text-foreground border border-border"
                  >
                    <Phone className="h-3.5 w-3.5" /> Contact Farmer
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MachineryOwnerLayout>
  );
}
