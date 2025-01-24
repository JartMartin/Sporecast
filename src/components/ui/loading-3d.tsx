import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface Loading3DProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loading3D({ size = "md", className }: Loading3DProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      "min-h-[calc(100vh-16rem)]", // Adjust vertical centering
      className
    )}>
      <div className={cn(
        "loader relative",
        size === "sm" && "loader--sm",
        size === "lg" && "loader--lg"
      )}>
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="logo absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm">
            <Sprout className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}