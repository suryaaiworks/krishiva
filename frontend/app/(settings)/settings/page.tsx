"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { 
  ArrowLeft, Bell, Globe, Lock, HelpCircle, Phone, 
  Smartphone, Sun, Moon, Monitor, Play
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [language, setLanguage] = React.useState("en");
  const [fontSize, setFontSize] = React.useState("medium");
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [pinLockEnabled, setPinLockEnabled] = React.useState(false);
  const [offlineMode, setOfflineMode] = React.useState(false);

  // Notification states
  const [notifications, setNotifications] = React.useState<NotificationSetting[]>([
    { id: "weather", label: "Weather Intelligence Alerts", description: "Warnings for storms, sudden rain, and dry spell warnings", enabled: true },
    { id: "market", label: "Market Price Indexes", description: "Daily price alerts for crop varieties and buyers request", enabled: true },
    { id: "schemes", label: "Government Subsidy Reminders", description: "Reminders for matching schemes, solar pump grants, and APMC news", enabled: true },
    { id: "disaster", label: "Regional Emergency Warnings", description: "Alerts for floods, cyclones, locusts, and heavy rainfall", enabled: true },
    { id: "buyers", label: "Direct B2B Buyer Requests", description: "Notifications when verified buyers seek crop quotas", enabled: false },
    { id: "ngos", label: "NGO seed & tool support alerts", description: "Notifies when local NGOs organize free seed distribution camps", enabled: true }
  ]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleSaveSettings = () => {
    alert("System configurations and notification channels updated successfully.");
  };

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => window.location.href = "/profile"}
            variant="outline"
            className="h-9 w-9 rounded-full p-0 bg-card border border-border text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <SectionHeader 
            title="App Settings & Controls" 
            description="Configure language preferences, dark/light themes, notifications channels, and biometric authentication."
            className="mb-0"
          />
        </div>

        {/* MAIN SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Configurations & Preferences (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Preferences Section (Theme, Language, Fonts) */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Globe className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Interface Preferences</h4>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                {/* Language Select */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Preferred Application Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-muted/20 border border-border rounded-btn px-3 h-10 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (US/India)</option>
                    <option value="mr">मराठी (Marathi - Western Zone)</option>
                    <option value="hi">हिन्दी (Hindi - Northern Belt)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi - Granary Zone)</option>
                  </select>
                </div>

                {/* Theme Select */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor }
                    ].map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-3 rounded-btn border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          theme === t.id
                            ? "border-primary bg-primary/5 text-primary font-bold"
                            : "border-border bg-card hover:bg-muted/10 text-muted-foreground"
                        }`}
                      >
                        <t.icon className="h-4.5 w-4.5 shrink-0" />
                        <span className="text-[10px]">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Size Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Accessibility Font Size</label>
                  <div className="flex gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 h-9 rounded-btn text-xs font-bold transition-all border cursor-pointer capitalize ${
                          fontSize === size
                            ? "bg-primary text-white border-primary"
                            : "bg-card text-muted-foreground hover:bg-muted/30 border-border"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offline Mode & Voice Assistant switches */}
                <div className="space-y-3.5 pt-3 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground">Voice Assistant Output</span>
                      <span className="text-[10.5px] text-muted-foreground block">Enable regional audio outputs from Gemini AI</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={voiceEnabled} 
                      onChange={() => setVoiceEnabled(!voiceEnabled)}
                      className="h-4.5 w-9 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-4.5"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground">Offline Sync Mode</span>
                      <span className="text-[10.5px] text-muted-foreground block">Cache satellite terrain profiles and crop history locally</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={offlineMode} 
                      onChange={() => setOfflineMode(!offlineMode)}
                      className="h-4.5 w-9 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-4.5"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Bell className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Advisory Notifications Configuration</h4>
              </div>

              <div className="divide-y divide-border/20">
                {notifications.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between py-3 text-xs leading-normal">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-foreground">{setting.label}</span>
                      <span className="text-[10.5px] text-muted-foreground block">{setting.description}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={setting.enabled} 
                      onChange={() => handleToggleNotification(setting.id)}
                      className="h-4.5 w-9 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-4.5 shrink-0"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleSaveSettings}
                className="flex-1 text-xs font-bold h-10 rounded-btn cursor-pointer bg-primary text-white"
              >
                Save Settings
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Security, Support & FAQ Desk (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Security Settings Card */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Lock className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Device Security & Biometrics</h4>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">Mock Biometric Login</span>
                    <span className="text-[10.5px] text-muted-foreground block">Unlock using fingerprint or Face ID</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={biometricsEnabled} 
                    onChange={() => setBiometricsEnabled(!biometricsEnabled)}
                    className="h-4.5 w-9 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-4.5"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">Secure PIN Lock</span>
                    <span className="text-[10.5px] text-muted-foreground block">Require 4-digit PIN before selling crops</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={pinLockEnabled} 
                    onChange={() => setPinLockEnabled(!pinLockEnabled)}
                    className="h-4.5 w-9 rounded-full appearance-none bg-muted checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-card after:transition-all checked:after:translate-x-4.5"
                  />
                </div>

                {/* Device sessions log */}
                <div className="pt-3 border-t border-border/20 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Device Sessions</span>
                  
                  <div className="flex items-center justify-between p-2.5 bg-muted/30 border border-border/60 rounded-btn">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4.5 w-4.5 text-primary shrink-0" />
                      <div className="space-y-0.5">
                        <span className="font-bold block text-[10.5px] text-foreground">OnePlus 11R (Primary)</span>
                        <span className="text-[9.5px] text-muted-foreground">Shirur, Pune • Active Now</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-bold px-2 text-[9px] bg-card border border-border text-foreground">
                      This Device
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Help & Support Desk */}
            <Card title="" animate={false} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Help & Support Desk</h4>
              </div>

              <div className="space-y-3.5 text-xs leading-normal">
                {/* Helpline button */}
                <div className="flex justify-between items-center p-3 rounded-btn border border-rose-500/20 bg-rose-500/5">
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[11px] text-foreground">Krishiva Helpline (Toll-Free)</span>
                    <span className="text-[9.5px] text-muted-foreground">Free farming support (24x7)</span>
                  </div>
                  <Button
                    onClick={() => alert("Dialing Krishiva Helpline: 1800-180-1551")}
                    size="sm"
                    className="h-8 rounded-btn cursor-pointer bg-primary text-white px-3 font-bold"
                  >
                    <Phone className="mr-1 h-3.5 w-3.5" />
                    Call
                  </Button>
                </div>

                {/* Support actions list */}
                <div className="space-y-2 text-[11px] text-muted-foreground pt-1 pl-1">
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-1.5 border-b border-border/30 cursor-pointer hover:text-primary transition-colors"
                  >
                    <span>Read Frequently Asked Questions</span>
                    <Play className="h-3 w-3 fill-current text-muted-foreground/40 rotate-90" />
                  </div>
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-1.5 border-b border-border/30 cursor-pointer hover:text-primary transition-colors"
                  >
                    <span>Chat with support officer</span>
                    <Play className="h-3 w-3 fill-current text-muted-foreground/40 rotate-90" />
                  </div>
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-1.5 cursor-pointer hover:text-primary transition-colors"
                  >
                    <span>Report a software bug / issue</span>
                    <Play className="h-3 w-3 fill-current text-muted-foreground/40 rotate-90" />
                  </div>
                </div>

                {/* About & Version */}
                <div className="pt-3 border-t border-border/20 text-center space-y-1">
                  <span 
                    onClick={() => router.push("/about")}
                    className="text-[10px] font-bold text-foreground block cursor-pointer hover:text-primary transition-colors"
                  >
                    Krishiva AI App
                  </span>
                  <span className="text-[9.5px] text-muted-foreground block">Version 1.0.4 (Production Build)</span>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
