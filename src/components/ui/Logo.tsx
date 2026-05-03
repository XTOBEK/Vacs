import React from "react";
import { Heart } from "lucide-react";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export default function Logo({ className, size = "md", inverted = false }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn(
        "absolute inset-0 blur-xl rounded-full scale-150 opacity-20",
        inverted ? "bg-white" : "bg-blue-600"
      )}></div>
      <div className={cn(
        "relative rounded-2xl flex items-center justify-center shadow-2xl border transition-transform hover:scale-105 active:scale-95 duration-300",
        sizes[size],
        inverted 
          ? "bg-white border-white/20 text-[#0B1D45]" 
          : "bg-[#0B1D45] border-[#C5A069]/30 text-[#C5A069]"
      )}>
        <Heart 
          size={iconSizes[size]} 
          fill="currentColor" 
          strokeWidth={0} 
          className="relative z-10"
        />
        {/* Decorative elements representing "wings" */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-inherit rounded-l-full border-l border-t border-b border-inherit opacity-50 transform -rotate-12"></div>
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-inherit rounded-r-full border-r border-t border-b border-inherit opacity-50 transform rotate-12"></div>
      </div>
    </div>
  );
}
