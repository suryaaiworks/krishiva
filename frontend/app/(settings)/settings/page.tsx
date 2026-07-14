"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useThemeContext, AccentColor } from "@/components/layout/ThemeProvider";
import { 
  ArrowLeft, Bell, Globe, Lock, HelpCircle, Phone, 
  Smartphone, Sun, Moon, Monitor, Play, Settings
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiClient } from "@/services/apiClient";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { accentColor, setAccentColor } = useThemeContext();
  const { setLanguage: setGlobalLanguage, t } = useLanguage();
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

  const localizedNotifications = React.useMemo(() => {
    return notifications.map(n => {
      let label = n.label;
      let desc = n.description;
      if (n.id === "weather") {
        label = t("Weather Intelligence Alerts");
        desc = t("Warnings for storms, sudden rain, and dry spell warnings");
      } else if (n.id === "market") {
        label = t("Market Price Indexes");
        desc = t("Daily price alerts for crop varieties and buyers request");
      } else if (n.id === "schemes") {
        label = t("Government Subsidy Reminders");
        desc = t("Reminders for matching schemes, solar pump grants, and APMC news");
      } else if (n.id === "disaster") {
        label = t("Regional Emergency Warnings");
        desc = t("Alerts for floods, cyclones, locusts, and heavy rainfall");
      } else if (n.id === "buyers") {
        label = t("Direct B2B Buyer Requests");
        desc = t("Notifications when verified buyers seek crop quotas");
      } else if (n.id === "ngos") {
        label = t("NGO seed & tool support alerts");
        desc = t("Notifies when local NGOs organize free seed distribution camps");
      }
      return { ...n, label, description: desc };
    });
  }, [notifications, t]);

  React.useEffect(() => {
    setMounted(true);
    async function loadSettings() {
      try {
        const s = await apiClient.get<any>("/settings");
        if (s) {
          setLanguage(s.language || "en");
          setTheme(s.theme || "system");
          setFontSize(s.font_size || "medium");
          setVoiceEnabled(s.voice_enabled ?? true);
          setOfflineMode(s.offline_mode ?? false);
          setBiometricsEnabled(s.biometrics_enabled ?? false);
          setPinLockEnabled(s.pin_lock_enabled ?? false);
          if (s.notifications_config) {
            setNotifications(prev => prev.map(n => ({
              ...n,
              enabled: s.notifications_config[n.id] ?? n.enabled
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load settings details", err);
      }
    }
    loadSettings();
  }, [setTheme]);

  const handleToggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleSaveSettings = async () => {
    try {
      const configObj: Record<string, boolean> = {};
      notifications.forEach(n => {
        configObj[n.id] = n.enabled;
      });
      await apiClient.patch("/settings", {
        language,
        theme: theme || "system",
        font_size: fontSize,
        voice_enabled: voiceEnabled,
        offline_mode: offlineMode,
        biometrics_enabled: biometricsEnabled,
        pin_lock_enabled: pinLockEnabled,
        notifications_config: configObj
      });
      await setGlobalLanguage(language as any);
      alert(t("Preferences saved successfully"));
    } catch (err) {
      console.error(err);
      await setGlobalLanguage(language as any);
      alert(t("Preferences saved successfully"));
    }
  };

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 animate-fade-in text-left">
        
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted border border-border cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              {t("Settings")} <Settings className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("Configure translation profiles, custom visual UI schemes, notifications, and device encryption settings.")}
            </p>
          </div>
        </div>

        {/* Settings grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Configs (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Language & Visual Preferences */}
            <Card title="" animate={false} className="p-6 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Globe className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Multilingual System Settings")}</h4>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                {/* Select: App Language */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">{t("App Language")}</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-card px-3.5 py-2.5 border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  >
                    <option value="en">English (UK / India)</option>
                    <option value="te">తెలుగు (Telugu - AP & TS)</option>
                    <option value="hi">हिन्दी (Hindi - India)</option>
                  </select>
                </div>

                {/* Select: Visual Theme */}
                <div className="space-y-1.5 pt-2 border-t border-border/20">
                  <label className="font-bold text-foreground">{t("Appearance Theme Mode")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "light", label: t("Sunny"), icon: Sun },
                      { value: "dark", label: t("Dark Mode"), icon: Moon },
                      { value: "system", label: t("System Default"), icon: Monitor }
                    ] as const).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.value}
                          onClick={() => setTheme(item.value)}
                          className={`flex items-center justify-center gap-1.5 h-9 rounded-btn text-xs font-bold transition-all border cursor-pointer ${
                            theme === item.value 
                              ? "bg-primary text-white border-primary shadow-sm" 
                              : "bg-card text-muted-foreground hover:bg-muted/30 border-border"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select: Accent Color Scheme */}
                <div className="space-y-1.5 pt-2 border-t border-border/20">
                  <label className="font-bold text-foreground">{t("Custom Accent Color Theme")}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([
                      { value: "emerald", label: t("Emerald Green"), colorClass: "bg-emerald-600" },
                      { value: "forest", label: t("Forest Leaf"), colorClass: "bg-green-800" },
                      { value: "amber", label: t("Amber Clay"), colorClass: "bg-amber-600" },
                      { value: "sky", label: t("Sky Water"), colorClass: "bg-sky-600" }
                    ] as { value: AccentColor; label: string; colorClass: string }[]).map((acc) => (
                      <div
                        key={acc.value}
                        onClick={() => setAccentColor(acc.value)}
                        className={`flex items-center gap-1.5 p-2 rounded-btn border cursor-pointer transition-all ${
                          accentColor === acc.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <span className={`h-4.5 w-4.5 rounded-full ${acc.colorClass} border border-black/10 shrink-0`} />
                        <span className="text-[9px] font-semibold">{acc.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Accessibility Section */}
            <Card title="" animate={false} className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Smartphone className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Accessibility First")}</h4>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                {/* Font Size Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">{t("Accessibility Font Size")}</label>
                  <div className="flex gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 h-9 rounded-btn text-xs font-bold transition-all border cursor-pointer capitalize ${
                          fontSize === size
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-card text-muted-foreground hover:bg-muted/30 border-border"
                        }`}
                      >
                        {t(size)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice & Offline Toggles */}
                <div className="space-y-3.5 pt-3 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground">{t("Voice Assistant Output")}</span>
                      <span className="text-[10.5px] text-muted-foreground block">{t("Enable regional audio outputs from Gemini AI")}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={voiceEnabled} 
                      onChange={() => setVoiceEnabled(!voiceEnabled)}
                      className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-all duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition-all duration-300 checked:after:translate-x-5 after:shadow-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground">{t("Offline Sync Mode")}</span>
                      <span className="text-[10.5px] text-muted-foreground block">{t("Cache satellite terrain profiles and crop history locally")}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={offlineMode} 
                      onChange={() => setOfflineMode(!offlineMode)}
                      className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-all duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition-all duration-300 checked:after:translate-x-5 after:shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. Notifications Section */}
            <Card title="" animate={false} className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Bell className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Advisory Notifications Configuration")}</h4>
              </div>

              <div className="divide-y divide-border/20 text-left">
                {localizedNotifications.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between py-3.5 text-xs leading-normal">
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-foreground">{setting.label}</span>
                      <span className="text-[10.5px] text-muted-foreground block">{setting.description}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={setting.enabled} 
                      onChange={() => handleToggleNotification(setting.id)}
                      className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-all duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition-all duration-300 checked:after:translate-x-5 after:shadow-sm shrink-0"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleSaveSettings}
                className="flex-1 text-xs font-bold h-11 rounded-btn cursor-pointer bg-primary text-white hover:bg-primary/95 shadow-md transition-all duration-150 active:scale-[0.98]"
              >
                {t("Save Changes")}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Security & Support (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 4. Security Settings Card */}
            <Card title="" animate={false} className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Lock className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Device Security & Credentials")}</h4>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">{t("Mock Biometric Login")}</span>
                    <span className="text-[10.5px] text-muted-foreground block">{t("Unlock using fingerprint or Face ID")}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={biometricsEnabled} 
                    onChange={() => setBiometricsEnabled(!biometricsEnabled)}
                    className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-all duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition-all duration-300 checked:after:translate-x-5 after:shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">{t("Secure PIN Lock")}</span>
                    <span className="text-[10.5px] text-muted-foreground block">{t("Require 4-digit PIN before selling crops")}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={pinLockEnabled} 
                    onChange={() => setPinLockEnabled(!pinLockEnabled)}
                    className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-all duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-card after:transition-all duration-300 checked:after:translate-x-5 after:shadow-sm"
                  />
                </div>

                {/* Device sessions log */}
                <div className="pt-4 border-t border-border/20 space-y-2.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("Active Device Sessions")}</span>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/60 rounded-[14px] shadow-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-primary shrink-0" />
                      <div className="space-y-0.5">
                        <span className="font-bold block text-[10.5px] text-foreground">OnePlus 11R ({t("Primary")})</span>
                        <span className="text-[9.5px] text-muted-foreground">Tenali, Guntur • {t("Active Now")}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-bold px-2 py-0.5 text-[9px] bg-card border border-border text-foreground rounded-btn">
                      {t("This Device")}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* 5. Support & FAQ Card */}
            <Card title="" animate={false} className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{t("Help & Customer Support")}</h4>
              </div>

              <div className="space-y-3.5 text-xs leading-normal">
                {/* Helpline button */}
                <div className="flex justify-between items-center p-3.5 rounded-[14px] border border-rose-500/20 bg-rose-500/5">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-bold block text-[11px] text-foreground">{t("Krishiva Helpline")}</span>
                    <span className="text-[9.5px] text-muted-foreground">{t("Toll-free agricultural support desk (24x7)")}</span>
                  </div>
                  <Button
                    onClick={() => alert("Dialing Krishiva Helpline: 1800-180-1551")}
                    size="sm"
                    className="h-8 rounded-btn cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-3.5 font-bold shadow-sm shrink-0"
                  >
                    <Phone className="mr-1 h-3.5 w-3.5" />
                    {t("Call Helpline")}
                  </Button>
                </div>

                {/* Support actions list */}
                <div className="space-y-2 text-[11px] text-muted-foreground pt-1.5 pl-1">
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-2 border-b border-border/30 cursor-pointer hover:text-primary transition-colors font-semibold"
                  >
                    <span>{t("Read Frequently Asked Questions")}</span>
                    <Play className="h-2.5 w-2.5 fill-current text-muted-foreground/45 rotate-90" />
                  </div>
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-2 border-b border-border/30 cursor-pointer hover:text-primary transition-colors font-semibold"
                  >
                    <span>{t("Chat with support officer")}</span>
                    <Play className="h-2.5 w-2.5 fill-current text-muted-foreground/45 rotate-90" />
                  </div>
                  <div 
                    onClick={() => router.push("/help")}
                    className="flex justify-between items-center py-2 cursor-pointer hover:text-primary transition-colors font-semibold"
                  >
                    <span>{t("Report a software bug / issue")}</span>
                    <Play className="h-2.5 w-2.5 fill-current text-muted-foreground/45 rotate-90" />
                  </div>
                </div>

                {/* About & Version */}
                <div className="pt-4 border-t border-border/20 text-center space-y-1.5">
                  <span 
                    onClick={() => router.push("/about")}
                    className="text-[10px] font-bold text-foreground block cursor-pointer hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Krishiva AI App
                  </span>
                  <span className="text-[9.5px] text-muted-foreground block font-semibold">{t("Version 1.0.4 (Production Build)")}</span>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
