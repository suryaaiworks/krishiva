"use client";

import * as React from "react";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeContext, AccentColor } from "@/components/layout/ThemeProvider";
import { Palette, Bell } from "lucide-react";

export default function BuyerSettingsPage() {
  const { accentColor, setAccentColor } = useThemeContext();

  const accentOptions: { id: AccentColor; label: string; color: string }[] = [
    { id: "forest", label: "Forest Green", color: "bg-emerald-600" },
    { id: "teal", label: "Teal Blue", color: "bg-teal-600" },
    { id: "blue", label: "Sky Blue", color: "bg-blue-600" },
    { id: "amber", label: "Amber Orange", color: "bg-amber-600" },
    { id: "rose", label: "Rose Red", color: "bg-rose-600" },
  ];

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            System Preferences
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Settings & Configurations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accent Customization */}
          <Card className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Accent Branding Theme</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose the primary color styling used throughout the Krishiva partner interfaces.
              </p>

              {/* Accent grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {accentOptions.map((opt) => {
                  const isActive = opt.id === accentColor;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAccentColor(opt.id)}
                      className={`p-3 rounded-btn border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isActive 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card/45 hover:bg-muted/10"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full shrink-0 ${opt.color}`} />
                      <span className="text-xs font-bold text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Alert Preferences */}
          <Card className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Alert Preferences</h3>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">SMS Sourcing Alerts</span>
                  <input type="checkbox" defaultChecked className="h-4 w-8 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3 after:w-3 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-3.5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Negotiation Counter Chat Notifications</span>
                  <input type="checkbox" defaultChecked className="h-4 w-8 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3 after:w-3 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-3.5" />
                </div>
              </div>
            </div>

            <Button 
              onClick={() => alert("Notification settings saved successfully.")}
              className="w-full h-11 justify-center rounded-btn font-bold cursor-pointer transition-all mt-6"
            >
              Save System Preferences
            </Button>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
