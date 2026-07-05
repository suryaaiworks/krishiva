"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Tractor, ArrowLeft, Search, MapPin, 
  Phone, CheckCircle2, User, Clock
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Machinery {
  id: string;
  name: string;
  price: string;
  dist: string;
  owner: string;
  phone: string;
  status: "available" | "rented" | "maintenance";
  rating: string;
}

const MACHINERY_RENTALS: Machinery[] = [
  { id: "1", name: "John Deere 5050D Tractor", price: "₹800/hour", dist: "1.2 km away", owner: "Ramesh K.", phone: "+91 98765 43210", status: "available", rating: "4.9" },
  { id: "2", name: "Pneumatic Seed Drill", price: "₹500/hour", dist: "0.8 km away", owner: "Dattatreya P.", phone: "+91 98223 88440", status: "available", rating: "4.7" },
  { id: "3", name: "Multicrop Combine Harvester", price: "₹1,500/hour", dist: "2.5 km away", owner: "Sanjay Patil", phone: "+91 90112 55432", status: "rented", rating: "4.8" },
  { id: "4", name: "Rotavator (Field Leveler)", price: "₹400/hour", dist: "3.1 km away", owner: "Baburao Mane", phone: "+91 94220 11993", status: "available", rating: "4.5" }
];

export default function MachineryRentalPage() {
  const router = useRouter();
  const [rentals, setRentals] = React.useState<Machinery[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [bookedId, setBookedId] = React.useState<string | null>(null);

  const loadRentals = async () => {
    try {
      const list = await apiClient.get<any[]>("/machinery");
      if (list && list.length > 0) {
        setRentals(list.map((m: any) => ({
          id: m.id,
          name: m.name,
          price: m.price,
          dist: m.dist,
          owner: m.owner,
          phone: m.phone,
          status: m.status,
          rating: m.rating
        })));
      } else {
        setRentals(MACHINERY_RENTALS);
      }
    } catch (err) {
      console.error("Failed to load machinery rentals", err);
      setRentals(MACHINERY_RENTALS);
    }
  };

  React.useEffect(() => {
    loadRentals();
  }, []);

  const filteredRentals = rentals.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookNow = async (id: string) => {
    setBookedId(id);
    setRentals(prev => prev.map(m => m.id === id ? { ...m, status: "rented" } : m));
    try {
      await apiClient.post("/machinery/book", { machinery_id: id });
      alert("Machinery booking registered in database successfully!");
    } catch (err) {
      console.error("Failed to register machinery booking", err);
    }
    setTimeout(() => {
      setBookedId(null);
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted border border-border"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Machinery Rental Hub <Tractor className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              Book local agricultural machinery, tractors, and harvesters directly from neighboring farmers.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative bg-card p-4 rounded-card border border-border/80 shadow-sm flex items-center gap-3">
          <Search className="absolute left-7.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tractors, levelers, seed drills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-9 pr-4 py-2 border border-border rounded-btn text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground"
          />
        </div>

        {/* Machinery Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRentals.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-xs text-muted-foreground bg-card border border-border rounded-card">
              No machinery rentals match your search filter.
            </div>
          ) : (
            filteredRentals.map((machinery) => (
              <Card 
                key={machinery.id} 
                title="" 
                animate={false} 
                className="p-5 bg-card border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3.5 text-left text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Tractor className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground leading-tight">{machinery.name}</h4>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {machinery.dist}
                        </span>
                      </div>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={`font-bold text-[9px] px-2 py-0.5 uppercase tracking-wide border-none ${
                        machinery.status === "available" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {machinery.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-border/20 text-[11px]">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Rental Rate</span>
                      <strong className="text-primary font-black text-sm">{machinery.price}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Provider / Rating</span>
                      <strong className="text-foreground font-bold flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {machinery.owner} ({machinery.rating} ★)
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {machinery.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      24h notice needed
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/20 flex gap-2">
                  <Button
                    onClick={() => handleBookNow(machinery.id)}
                    disabled={machinery.status !== "available"}
                    className="flex-1 rounded-btn h-9 font-bold bg-primary text-white text-xs cursor-pointer disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {machinery.status === "available" ? "Book Now" : "Rented / Unavailable"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Success toast simulation */}
        {bookedId && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-card shadow-2xl flex items-center gap-2 text-xs border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <span className="font-bold block">Booking Confirmed!</span>
              <span className="text-[10px] text-emerald-100 block">We have messaged the machinery owner. Expect a callback.</span>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
