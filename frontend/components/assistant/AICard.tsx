"use client";

import * as React from "react";
import { Sparkles, Volume2, Languages, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AICardProps {
  content: string;
  timestamp?: string;
  isGenerating?: boolean;
  onSpeak?: () => void;
  onTranslate?: () => void;
  className?: string;
}

export function AICard({
  content,
  timestamp,
  isGenerating = false,
  onSpeak,
  onTranslate,
  className,
}: AICardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <Card
      title=""
      animate={false}
      className={cn(
        "relative border-l-4 border-l-primary bg-card/60 p-5 shadow-sm backdrop-blur-sm overflow-hidden",
        isGenerating && "animate-pulse border-l-accent",
        className
      )}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              Vira AI Advisor
            </span>
            {timestamp && (
              <span className="text-[10px] text-muted-foreground">
                {timestamp}
              </span>
            )}
          </div>

          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {isGenerating ? (
              <div className="space-y-2 py-1">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
              </div>
            ) : (
              content
            )}
          </div>

          {!isGenerating && (
            <div className="flex items-center gap-1.5 pt-2.5 border-t border-border/50">
              {onSpeak && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-[min(var(--radius-md),12px)] [&_svg]:size-3.5"
                  title="Speak advice"
                  onClick={onSpeak}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {onTranslate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-[min(var(--radius-md),12px)] [&_svg]:size-3.5"
                  title="Translate advice"
                  onClick={onTranslate}
                >
                  <Languages className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-[min(var(--radius-md),12px)] [&_svg]:size-3.5"
                title="Copy to clipboard"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
