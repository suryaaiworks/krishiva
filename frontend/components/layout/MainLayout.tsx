"use client";

import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DemoController } from "@/components/layout/DemoController";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* Hidden floating Demo Selector */}
      <DemoController />
    </div>
  );
}
