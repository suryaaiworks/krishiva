"use client";

import * as React from "react";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceButton({ isListening, onClick, className }: VoiceButtonProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {isListening && (
        <>
          {/* Wave ripple 1 */}
          <motion.div
            className="absolute h-20 w-20 rounded-full bg-primary/20"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeOut",
            }}
          />
          {/* Wave ripple 2 */}
          <motion.div
            className="absolute h-20 w-20 rounded-full bg-primary/10"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.6,
              ease: "easeOut",
            }}
          />
        </>
      )}

      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-border shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer",
          isListening
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/95 border-transparent"
            : "bg-primary text-primary-foreground hover:bg-primary/95 border-transparent"
        )}
      >
        {isListening ? (
          <Square className="h-5 w-5" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
