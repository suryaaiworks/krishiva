"use client";

import * as React from "react";
import { OwnerSidebar } from "@/components/navigation/OwnerSidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { OwnerBottomNav } from "@/components/navigation/OwnerBottomNav";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if (accessToken) {
        localStorage.setItem("krishiva_token", accessToken);
        localStorage.setItem("krishiva_role", "owner");
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    const token = localStorage.getItem("krishiva_token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <OwnerSidebar />

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
        <OwnerBottomNav />
      </div>
    </div>
  );
}
