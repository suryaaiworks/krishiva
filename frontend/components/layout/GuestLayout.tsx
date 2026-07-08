"use client";

import * as React from "react";
import { GuestSidebar } from "@/components/navigation/GuestSidebar";
import { TopBar } from "@/components/navigation/TopBar";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  React.useEffect(() => {
    const token = localStorage.getItem("krishiva_token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <GuestSidebar />

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
      </div>
    </div>
  );
}
