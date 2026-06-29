"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/constants/navigation";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-card/90 backdrop-blur-md px-2 md:hidden">
      <div className="flex h-full items-center justify-around">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-1 flex-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive && "text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-x-6 top-0 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn(isActive && "text-foreground font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
