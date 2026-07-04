"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MachineryOwnerSidebar } from "@/components/navigation/MachineryOwnerSidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Footer } from "@/components/navigation/Footer";
import { LayoutDashboard, Tractor, CalendarDays, DollarSign, User } from "lucide-react";

interface MachineryOwnerLayoutProps {
  children: React.ReactNode;
}

export function MachineryOwnerLayout({ children }: MachineryOwnerLayoutProps) {
  const pathname = usePathname();

  const mobileItems = [
    { href: "/machinery-owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/machinery-owner/machines", label: "Machines", icon: Tractor },
    { href: "/machinery-owner/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/machinery-owner/earnings", label: "Earnings", icon: DollarSign },
    { href: "/machinery-owner/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <MachineryOwnerSidebar />

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

        <Footer />

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-card/90 backdrop-blur-md px-2 md:hidden">
          <div className="flex h-full items-center justify-around">
            {mobileItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex h-full flex-col items-center justify-center gap-1 flex-1 text-[9px] font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="machinery-owner-bottom-nav-active"
                      className="absolute inset-x-4 top-0 h-0.75 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("h-4.8 w-4.8", isActive && "text-primary")} />
                  <span className={cn(isActive && "text-foreground font-bold")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
