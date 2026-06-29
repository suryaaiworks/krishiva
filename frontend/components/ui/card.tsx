/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type MotionDivProps = HTMLMotionProps<"div">;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: React.ReactNode;
  animate?: boolean;
  motionProps?: MotionDivProps;
  children?: React.ReactNode;
}

export function Card({
  className,
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
  animate = true,
  motionProps,
  children,
  ...props
}: CardProps) {
  if (animate) {
    return (
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-card border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md",
          className
        )}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        {...motionProps}
        {...(props as any)}
      >
        <div className="flex flex-col h-full gap-4">
          {Icon && (
            <div
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary",
                iconClassName
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-1.5">
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {children && <div className="mt-2">{children}</div>}

          {action && <div className="mt-auto pt-4">{action}</div>}
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex flex-col h-full gap-4">
        {Icon && (
          <div
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary",
              iconClassName
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}

        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mt-2">{children}</div>}

        {action && <div className="mt-auto pt-4">{action}</div>}
      </div>
    </div>
  );
}
