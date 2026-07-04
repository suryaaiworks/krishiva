"use client";

import * as React from "react";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, ShieldCheck, Tractor, HelpCircle } from "lucide-react";

export default function AvailabilityCalendarPage() {
  const [selectedMachine, setSelectedMachine] = React.useState("John Deere 5050D");
  const [unavailableDates, setUnavailableDates] = React.useState<number[]>([12, 13, 14, 15, 22, 23]);

  // Handle clicking a day to toggle availability
  const handleToggleDate = (dayNum: number) => {
    if (dayNum === 0) return; // padding cell
    setUnavailableDates(prev => 
      prev.includes(dayNum) 
        ? prev.filter(d => d !== dayNum) 
        : [...prev, dayNum]
    );
  };

  // 35 cells representing October 2026 (Starts on Thursday, so 4 empty days at start)
  const daysInMonth = 31;
  const startOffset = 4; // Thurs
  const calendarCells = [];
  
  // Padding cells
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(0);
  }
  
  // Actual month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Next month padding to fill grid
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(0);
  }

  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Calendar Scheduler
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Availability Calendar
          </h2>
        </div>

        {/* Top select bar */}
        <Card className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Tractor className="h-5 w-5 text-primary shrink-0" />
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="bg-muted/30 border border-border rounded-input px-3.5 h-10 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer w-full sm:w-64"
            >
              <option value="John Deere 5050D">John Deere 5050D (Tractor)</option>
              <option value="Mahindra Arjun 555">Mahindra Arjun 555 (Tractor)</option>
              <option value="Rotavator Heavy Duty">Rotavator Heavy Duty (Cultivator)</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-rose-500/10 border border-rose-500/20" />
              <span className="text-muted-foreground">Unavailable / Booked</span>
            </div>
          </div>
        </Card>

        {/* Calendar Core layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Grid */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-foreground">October 2026</h3>
              <Badge variant="outline" className="text-[9px] px-2 py-0.5">Time Zone: IST</Badge>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {weekdayNames.map(wd => (
                <div key={wd} className="py-1">{wd}</div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((dayNum, idx) => {
                if (dayNum === 0) {
                  return <div key={idx} className="aspect-square bg-muted/5 rounded-card border border-transparent" />;
                }
                const isBlocked = unavailableDates.includes(dayNum);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleDate(dayNum)}
                    className={`aspect-square rounded-card border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                      isBlocked 
                        ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 text-rose-600" 
                        : "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    <span className="text-xs font-black text-foreground">{dayNum}</span>
                    <span className="text-[7.5px] font-extrabold uppercase self-end tracking-tight">
                      {isBlocked ? "Blocked" : "Free"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick instructions panel */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Instructions</h3>
              
              <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  1. Select a machine from the dropdown menu to manage its availability.
                </p>
                <p>
                  2. Click on any active date box inside the calendar to toggle its availability status instantly.
                </p>
                <p>
                  3. Unavailable dates will block farmers from selecting this equipment inside their search panels.
                </p>
              </div>

              <div className="p-3.5 rounded-btn bg-amber-500/5 border border-amber-500/10 text-amber-800 dark:text-amber-200 text-xs flex gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Blocking dates will automatically cancel any unconfirmed booking requests for those days.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => alert("Calendar settings saved successfully.")}
              className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all mt-6"
            >
              Save Schedule Preferences
            </Button>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
}
