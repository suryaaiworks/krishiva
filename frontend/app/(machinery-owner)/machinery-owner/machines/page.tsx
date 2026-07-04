"use client";

import * as React from "react";
import { MachineryOwnerLayout } from "@/components/layout/MachineryOwnerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tractor, Plus, Trash2, Fuel, Gauge, Weight, 
  Settings, PenTool, Edit2, Sparkles, X, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyMachinesPage() {
  const [machines, setMachines] = React.useState([
    { id: 1, model: "John Deere 5050D", category: "Tractor", capacity: "50 HP", rateHour: "₹450/hr", rateDay: "₹3,200/day", location: "Pune Hub, MH", desc: "Heavy-duty dual clutch tractor suitable for tillage and sowing.", isAvailable: true },
    { id: 2, model: "Mahindra Arjun 555", category: "Tractor", capacity: "57 HP", rateHour: "₹400/hr", rateDay: "₹2,800/day", location: "Nagpur Hub, MH", desc: "High fuel efficiency tractor ideal for sugarcane farming.", isAvailable: false },
    { id: 3, model: "Rotavator Heavy Duty", category: "Cultivator", capacity: "6 Feet", rateHour: "₹250/hr", rateDay: "₹1,500/day", location: "Jalgaon Hub, MH", desc: "Perfect for preparing soil beds quickly.", isAvailable: true },
  ]);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newModel, setNewModel] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Tractor");
  const [newCapacity, setNewCapacity] = React.useState("");
  const [newRateHour, setNewRateHour] = React.useState("");
  const [newRateDay, setNewRateDay] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel || !newCapacity || !newRateHour || !newRateDay || !newLocation) return;

    setMachines(prev => [
      ...prev,
      {
        id: Date.now(),
        model: newModel,
        category: newCategory,
        capacity: newCapacity,
        rateHour: `₹${newRateHour}/hr`,
        rateDay: `₹${newRateDay}/day`,
        location: newLocation,
        desc: newDesc || "No description provided.",
        isAvailable: true
      }
    ]);

    // reset
    setNewModel("");
    setNewCapacity("");
    setNewRateHour("");
    setNewRateDay("");
    setNewLocation("");
    setNewDesc("");
    setIsAddOpen(false);
  };

  const handleDeleteMachine = (id: number) => {
    setMachines(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleAvailability = (id: number) => {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  return (
    <MachineryOwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Fleet Management
            </span>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              My Machinery Fleet
            </h2>
          </div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-bold gap-1.5 h-10 rounded-btn cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Machine
          </Button>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((mac) => (
            <Card key={mac.id} className="overflow-hidden border border-border/50 relative flex flex-col justify-between p-5 hover:shadow-md transition-shadow duration-300">
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
                    <Tractor className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] text-muted-foreground font-semibold">Availability</span>
                    <button 
                      onClick={() => handleToggleAvailability(mac.id)}
                      className={`h-5 w-9 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        mac.isAvailable ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition-all duration-200 ${
                        mac.isAvailable ? "left-4.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Model Info */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{mac.category}</span>
                  <h4 className="text-base font-extrabold text-foreground tracking-tight leading-snug">{mac.model}</h4>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed line-clamp-2">{mac.desc}</p>
                </div>

                {/* Specifications List */}
                <div className="space-y-2 pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div>
                    <span>Capacity/Spec: <span className="font-bold text-foreground">{mac.capacity}</span></span>
                  </div>
                  <div>
                    <span>Location: <span className="font-bold text-foreground">{mac.location}</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span>Hour: <span className="font-bold text-primary">{mac.rateHour}</span></span>
                    <span>Day: <span className="font-bold text-primary">{mac.rateDay}</span></span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-border/40 flex justify-between gap-3">
                <Button 
                  size="sm"
                  variant="outline" 
                  className="text-[10px] font-bold h-8.5 rounded-btn bg-card flex-1 flex justify-center items-center cursor-pointer"
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit Machine
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteMachine(mac.id)}
                  className="text-[10px] font-bold h-8.5 rounded-btn bg-card text-rose-500 border border-rose-500/20 hover:bg-rose-500/5 flex justify-center items-center cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Machine Modal Overlay */}
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
                    <h3 className="text-base font-extrabold text-foreground">Add New Machinery</h3>
                  </div>
                  <button 
                    onClick={() => setIsAddOpen(false)}
                    className="h-7 w-7 rounded-full bg-muted/20 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddMachine} className="space-y-3.5 text-xs">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Machine Type</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                    >
                      <option value="Tractor">Tractor</option>
                      <option value="Harvester">Harvester (Combine)</option>
                      <option value="Seeder">Seeder / Planter</option>
                      <option value="Cultivator">Cultivator / Rotavator</option>
                    </select>
                  </div>

                  {/* Model Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Model Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Deere 5050D"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* HP / Capacity */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Capacity / Specifications</label>
                    <input
                      type="text"
                      placeholder="e.g. 50 HP or 6 Feet Wide"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Rates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase">Price per Hour (INR)</label>
                      <input
                        type="number"
                        placeholder="e.g. 450"
                        value={newRateHour}
                        onChange={(e) => setNewRateHour(e.target.value)}
                        className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase">Price per Day (INR)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3200"
                        value={newRateDay}
                        onChange={(e) => setNewRateDay(e.target.value)}
                        className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Pune Hub, MH"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase">Description</label>
                    <textarea
                      placeholder="Brief details about tractor maintenance status, attachments included..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-input px-3.5 py-2 h-16 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 justify-center rounded-btn font-bold cursor-pointer transition-all mt-1"
                  >
                    Confirm Add Machinery
                  </Button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MachineryOwnerLayout>
  );
}
