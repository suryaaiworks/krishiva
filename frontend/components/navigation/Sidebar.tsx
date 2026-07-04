"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { Sprout } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-border bg-card p-4 sticky top-0">
      <div className="flex items-center gap-2.5 px-3 py-4 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-primary text-primary-foreground">
          <Sprout className="h-5 w-5" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Krishiva <span className="text-primary">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-btn px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "text-primary hover:bg-transparent"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-btn bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("relative z-10 h-5 w-5", isActive && "text-primary")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-4 px-3 text-[10px] text-muted-foreground">
        © 2026 Krishiva
      </div>
    </aside>
  );
}
