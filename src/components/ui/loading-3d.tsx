import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface Loading3DProps {
  size?: "sm" | "md" | "lg";
}

export function Loading3D({ size = "md" }: Loading3DProps) {
  return (
    <div className={cn(
      "loader",
      size === "sm" && "loader--sm",
      size === "lg" && "loader--lg",
      "flex items-center justify-center min-h-[50vh]"
    )}>
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="logo">
        <Sprout />
      </div>
    </div>
  );
}