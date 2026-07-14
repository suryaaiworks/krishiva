"use client";

import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Footer } from "@/components/navigation/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ViraVoiceWidget } from "@/components/ai/ViraVoiceWidget";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if (accessToken) {
        localStorage.setItem("krishiva_token", accessToken);
        localStorage.setItem("krishiva_role", "farmer");
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    const token = localStorage.getItem("krishiva_token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // Wave 5: Reset scroll position to top on every route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopBar />

        {/* Premium Status Banner */}
        <div className="sticky top-16 z-20 w-full border-b border-emerald-500/15 bg-emerald-50/80 dark:bg-emerald-950/20 backdrop-blur-sm select-none">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3.5 flex-wrap">
            {/* Farm Connected pill */}
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="kv-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {t("Farm Connected")}
            </span>
            <span className="text-emerald-500/40 text-xs">|</span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400">
              {t("Crop Health")}: 92%
            </span>
            <span className="text-emerald-500/40 text-xs">|</span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400">
              ☀️ {t("Sunny")}
            </span>
            <span className="text-emerald-500/40 text-xs">|</span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400">
              {t("Last Sync")}: {t("Just now")}
            </span>
            <span className="text-emerald-500/40 text-xs">|</span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse animate-duration-1000" />
              {t("AI Active")}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>

        <Footer />

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* Vira AI Floating Copilot widget */}
      <ViraVoiceWidget />
    </div>
  );
}

