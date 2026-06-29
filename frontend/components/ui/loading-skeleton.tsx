import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/80",
        variant === "text" && "h-4 w-full rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-md",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-border rounded-card bg-card p-6 space-y-4">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-1/3" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    </div>
  );
}
