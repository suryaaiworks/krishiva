"use client";

import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Footer } from "@/components/navigation/Footer";
import { DemoController, scenarios } from "@/components/layout/DemoController";
import { useThemeContext } from "@/components/layout/ThemeProvider";
import { Sparkles } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { activeScenarioId } = useThemeContext();
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopBar />

        {/* Sticky Demo Banner */}
        <div className="sticky top-16 z-20 w-full border-b border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-center">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="leading-snug break-words max-w-full">
              {activeScenario.alert}
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

      {/* Hidden floating Demo Selector */}
      <DemoController />
    </div>
  );
}
