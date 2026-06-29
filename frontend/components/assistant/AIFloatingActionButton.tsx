"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AIFloatingActionButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function AIFloatingActionButton({
  className,
  onClick,
  href = "/assistant",
}: AIFloatingActionButtonProps) {
  const content = (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute -inset-1.5 rounded-full border-2 border-primary/35 animate-ping opacity-45 pointer-events-none" />
      <Sparkles className="h-6 w-6 relative z-10" />
    </motion.button>
  );

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-30 pointer-events-none">
      {href && !onClick ? (
        <Link href={href} className="pointer-events-auto">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
