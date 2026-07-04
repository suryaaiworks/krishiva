"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Tractor, Calendar, CheckSquare, User } from "lucide-react";

export function OwnerBottomNav() {
  const pathname = usePathname();

  const mobileItems = [
    { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/owner/machinery", label: "Machinery", icon: Tractor },
    { href: "/owner/calendar", label: "Calendar", icon: Calendar },
    { href: "/owner/bookings", label: "Bookings", icon: CheckSquare },
    { href: "/owner/profile", label: "Profile", icon: User },
  ];

  return (
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
                  layoutId="owner-bottom-nav-active"
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
  );
}
