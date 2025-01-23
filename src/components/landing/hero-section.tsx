import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeroSectionProps {
  isVisible: boolean;
}

export function HeroSection({ isVisible }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const titleTimer = setTimeout(() => setTitleVisible(true), 300);
      const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 600);
      const ctaTimer = setTimeout(() => setCtaVisible(true), 900);

      return () => {
        clearTimeout(titleTimer);
        clearTimeout(subtitleTimer);
        clearTimeout(ctaTimer);
      };
    }
  }, [isVisible]);

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className={cn(
          "transition-all duration-1000",
          titleVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Badge 
            variant="outline" 
            className="mb-6 bg-white/50 backdrop-blur-sm border-teal-200 text-teal-800 px-3 py-1"
          >
            Academically Driven, Economically Guided, Mathematically Powered.
          </Badge>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            <span className="text-gray-900">Stay Ahead of </span>
            <span className="relative inline-block">
              <span className="absolute -inset-2 rounded-lg bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-lg" />
              <span className="relative bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Food Commodity Markets
              </span>
            </span>{" "}
            <span className="text-gray-900">with Data-Driven Forecasting</span>
          </h1>
        </div>

        <p className={cn(
          "text-lg text-gray-600 max-w-2xl transition-all duration-1000 delay-200",
          subtitleVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          Transform food market uncertainty into reliable, real-time forecasts using best-in-class methods to enhance procurement strategies.
        </p>
      </div>

      <div className={cn(
        "relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-xl p-6 transition-all duration-1000 delay-400",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-teal-500/10 before:to-emerald-500/10",
        "after:absolute after:inset-0 after:rounded-xl after:bg-white/50 after:backdrop-blur-sm",
        ctaVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <div className="flex-1 min-w-[200px] relative z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/auth?tab=signup" className="block">
                  <Button 
                    size="lg" 
                    className="w-full relative group overflow-hidden h-12"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 group-hover:scale-[1.02]" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-teal-900 text-white">
                <p>Start your 14-day free trial now!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-center sm:text-left font-medium text-teal-900/70 mt-2">
            14-day free trial • Full premium access
          </p>
        </div>

        <div className="hidden sm:block h-12 relative z-10">
          <Separator orientation="vertical" className="bg-teal-200/50" />
        </div>

        <div className="flex-1 min-w-[200px] relative z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/schedule" className="block">
                  <Button 
                    variant="outline"
                    size="lg"
                    className={cn(
                      "w-full border-2 border-teal-600/20 hover:border-teal-600/40 bg-white hover:bg-teal-50/50 transition-all duration-300 h-12",
                      "group relative overflow-hidden"
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-teal-700">
                      Schedule an online coffee
                      <Coffee className={cn(
                        "h-4 w-4 transition-all duration-500",
                        isHovered ? "rotate-12 scale-110" : ""
                      )} />
                    </span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-teal-900 text-white">
                <p>Let's have a friendly chat about your needs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-center sm:text-left font-medium text-teal-900/70 mt-2">
            Completely free • No strings attached
          </p>
        </div>
      </div>
    </div>
  );
}