"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Tractor, ArrowLeft, Search, MapPin, 
  Phone, CheckCircle2, User, Clock, CalendarRange, X
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

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
  { id: "1", name: "John Deere 5050D Tractor", price: "₹800/hour", dist: "1.2 km away", owner: "Ramesh K. (Shirur)", phone: "+91 98765 43210", status: "available", rating: "4.9" },
  { id: "2", name: "Pneumatic Seed Drill", price: "₹500/hour", dist: "0.8 km away", owner: "Dattatreya P. (Pune)", phone: "+91 98223 88440", status: "available", rating: "4.7" },
  { id: "3", name: "Mahindra Arjun 555 Tractor", price: "₹750/hour", dist: "2.3 km away", owner: "K. Venkateswara Rao (Guntur)", phone: "+91 86323 11445", status: "available", rating: "4.8" },
  { id: "4", name: "Sugarcane Heavy Harvester", price: "₹1,800/hour", dist: "4.5 km away", owner: "M. Satyanarayana (Nellore)", phone: "+91 86124 55990", status: "available", rating: "4.9" },
  { id: "5", name: "Multicrop Combine Harvester", price: "₹1,500/hour", dist: "5.1 km away", owner: "Sanjay Patil (Baramati)", phone: "+91 90112 55432", status: "rented", rating: "4.8" },
  { id: "6", name: "Rotavator (Field Leveler)", price: "₹400/hour", dist: "3.1 km away", owner: "Baburao Mane (Haveli)", phone: "+91 94220 11993", status: "available", rating: "4.5" }
];

export default function MachineryRentalPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [rentals, setRentals] = React.useState<Machinery[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [bookedId, setBookedId] = React.useState<string | null>(null);
  
  // Date picker selection states
  const [bookingMachinery, setBookingMachinery] = React.useState<Machinery | null>(null);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [bookingHistory, setBookingHistory] = React.useState<any[]>([]);
  const [bookedDetails, setBookedDetails] = React.useState<{ name: string; date: string; time?: string } | null>(null);

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

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

  const loadBookingHistory = async () => {
    try {
      const history = await apiClient.get<any[]>("/machinery/bookings");
      setBookingHistory(history || []);
    } catch (err) {
      console.warn("Failed to load booking history", err);
    }
  };

  React.useEffect(() => {
    loadRentals();
    loadBookingHistory();
  }, []);

  const filteredRentals = rentals.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (machinery: Machinery) => {
    setBookingMachinery(machinery);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingMachinery || !selectedDate) return;

    try {
      await apiClient.post("/machinery/book", {
        machinery_id: bookingMachinery.id,
        booking_date: selectedDate,
        booking_time: selectedTime || null
      });
      
      setBookedDetails({
        name: bookingMachinery.name,
        date: selectedDate,
        time: selectedTime || undefined
      });
      setBookedId(bookingMachinery.id);
      
      // Update local rentals status
      setRentals(prev => prev.map(m => m.id === bookingMachinery.id ? { ...m, status: "rented" } : m));
      
      // Reload booking history
      await loadBookingHistory();
      
      // Reset state
      setBookingMachinery(null);
      setSelectedDate("");
      setSelectedTime("");
      
      setTimeout(() => {
        setBookedId(null);
        setBookedDetails(null);
      }, 5000);
    } catch (err) {
      alert("Failed to confirm booking. Please try again.");
      console.error("Booking error:", err);
    }
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
                    onClick={() => handleBookClick(machinery)}
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

        {/* Booking Date/Time Modal */}
        {bookingMachinery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md border border-border/80 rounded-card p-6 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <h3 className="font-heading text-base font-extrabold text-foreground flex items-center gap-2">
                  <CalendarRange className="h-5 w-5 text-primary" />
                  {t("Book Now")}
                </h3>
                <button 
                  onClick={() => setBookingMachinery(null)}
                  className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-xs space-y-1.5 bg-muted/20 p-3 rounded-btn border border-border/40 font-semibold">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Machine:</span>
                  <span className="font-extrabold text-foreground">{bookingMachinery.name}</span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-1.5 mt-1.5">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-extrabold text-primary">{bookingMachinery.price}</span>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide block">
                    Choose Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={todayStr}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-btn px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide block">
                    Choose Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-background border border-border rounded-btn px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  />
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-border/40">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingMachinery(null)}
                    className="flex-1 h-11 text-xs font-bold rounded-btn border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 text-xs font-black rounded-btn bg-primary text-white hover:bg-primary/95 shadow-sm cursor-pointer"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booking History Section */}
        <div className="bg-card p-6 rounded-card border border-border/80 shadow-sm text-left space-y-4 mt-8">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            Your Booking History
          </h3>
          {bookingHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-btn">
              You haven&apos;t booked any machinery yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 font-semibold">Machine</th>
                    <th className="py-2 font-semibold">Scheduled Date</th>
                    <th className="py-2 font-semibold">Time</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bookingHistory.map((historyItem) => {
                    const matchedName = rentals.find(r => r.id === historyItem.machinery_id)?.name || "Agricultural Machine";
                    return (
                      <tr key={historyItem.id} className="text-foreground">
                        <td className="py-2.5 font-bold">{matchedName}</td>
                        <td className="py-2.5 font-semibold text-muted-foreground">{historyItem.booking_date}</td>
                        <td className="py-2.5 text-muted-foreground">{historyItem.booking_time || "Not specified"}</td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none capitalize font-bold text-[9px] px-2 py-0.5">
                            {historyItem.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Success toast simulation */}
        {bookedId && bookedDetails && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-card shadow-2xl flex items-center gap-2 text-xs border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div className="text-left">
              <span className="font-bold block">Booking Confirmed!</span>
              <span className="text-[10px] text-emerald-100 block mt-0.5">
                {bookedDetails.name} is booked for {bookedDetails.date} {bookedDetails.time ? `at ${bookedDetails.time}` : ""}.
              </span>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
