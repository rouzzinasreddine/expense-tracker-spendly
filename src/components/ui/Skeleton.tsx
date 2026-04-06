import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "row" | "chart" | "circle";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-slate-800/60 transition-all";

  const variantClasses = {
    card: "rounded-2xl h-32 w-full",
    text: "rounded h-4 w-full",
    row: "rounded-xl h-12 w-full",
    chart: "rounded-2xl h-64 w-full",
    circle: "rounded-full h-10 w-10",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
