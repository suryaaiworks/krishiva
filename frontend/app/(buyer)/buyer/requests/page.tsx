"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, ClipboardList, Layers, TrendingUp, MapPin, 
  Sparkles, X, ChevronRight, CalendarDays 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PurchaseRequestsPage() {
  const [requests, setRequests] = React.useState([
    { id: 1, crop: "Sugarcane (Grade A)", quantity: "15 Tons", expectedPrice: "₹3,400/Ton", location: "Pune, MH", date: "Oct 15, 2026", status: "Matching" },
    { id: 2, crop: "Wheat (Lokwan)", quantity: "8 Tons", expectedPrice: "₹2,600/Ton", location: "Nagpur, MH", date: "Oct 20, 2026", status: "Active" },
    { id: 3, crop: "Organic Bananas", quantity: "4 Tons", expectedPrice: "₹18,000/Ton", location: "Jalgaon, MH", date: "Oct 22, 2026", status: "Matching" },
  ]);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newCrop, setNewCrop] = React.useState("");
  const [newQuantity, setNewQuantity] = React.useState("");
  const [newPrice, setNewPrice] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("");
  const [newDate, setNewDate] = React.useState("");

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop || !newQuantity || !newPrice || !newLocation || !newDate) return;

    setRequests(prev => [
      ...prev,
      {
        id: Date.now(),
        crop: newCrop,
        quantity: `${newQuantity} Tons`,
        expectedPrice: `₹${newPrice}/Ton`,
        location: newLocation,
        date: newDate,
        status: "Active"
      }
    ]);

    // reset
    setNewCrop("");
    setNewQuantity("");
    setNewPrice("");
    setNewLocation("");
    setNewDate("");
    setIsAddOpen(false);
  };

  const handleDeleteRequest = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Sourcing Registry
            </span>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Purchase Requests
            </h2>
          </div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-bold gap-1.5 h-10 rounded-btn cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Request
          </Button>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="overflow-hidden border border-border/50 relative flex flex-col justify-between p-5 hover:shadow-md transition-shadow duration-300">
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
                    <ClipboardList className="h-5.5 w-5.5" />
                  </div>
                  <Badge variant={req.status === "Matching" ? "success" : "outline"} className="text-[8px] font-bold px-2 py-0.5">
                    {req.status}
                  </Badge>
                </div>

                {/* Model Info */}
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-foreground tracking-tight leading-snug">{req.crop}</h4>
                </div>

                {/* Details list */}
                <div className="space-y-2 pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>Quantity: <span className="font-bold text-foreground">{req.quantity}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>Expected Price: <span className="font-bold text-primary">{req.expectedPrice}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>Location: <span className="font-bold text-foreground">{req.location}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>Delivery Date: <span className="font-bold text-foreground">{req.date}</span></span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-border/40 flex justify-end">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteRequest(req.id)}
                  className="text-[10px] font-bold h-8.5 rounded-btn bg-card text-rose-500 border border-rose-500/20 hover:bg-rose-500/5 flex justify-center items-center cursor-pointer flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete Request
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Request Modal Overlay */}
        <AnimatePresence>
          {isAddOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddOpen(false)}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border w-full max-w-md rounded-card p-6 shadow-2xl space-y-5"
              >
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <h3 className="text-base font-extrabold text-foreground">Create Purchase Request</h3>
                  </div>
                  <button 
                    onClick={() => setIsAddOpen(false)}
                    className="h-7 w-7 rounded-full bg-muted/20 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handlePostRequest} className="space-y-4 text-xs">
                  {/* Crop Type */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Crop Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Wheat (Lokwan) or Sugarcane"
                      value={newCrop}
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Required Quantity (Tons)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Expected Price */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Expected Price (INR/Ton)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3200"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Preferred Delivery Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Pune, Maharashtra"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Delivery Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-11 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all mt-2"
                  >
                    Confirm Create Request
                  </Button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </BuyerLayout>
  );
}
const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
