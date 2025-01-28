import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  isVisible: boolean;
}

export function HeroSection({ isVisible }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 300);

    const highlightTimer = setTimeout(() => {
      setShowHighlight(true);
    }, 800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(highlightTimer);
    };
  }, [isVisible]);

  return (
    <div className="space-y-12">
      <div className="min-h-[240px] flex flex-col">
        <div className={cn(
          "transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Badge 
            variant="outline" 
            className="bg-white/50 backdrop-blur-sm border-teal-200 text-teal-800 px-3 py-1 mb-6"
          >
            Academically Driven, Economically Guided, Mathematically Powered
          </Badge>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight overflow-hidden">
            <span className="inline-block">
              <span className={cn(
                "inline-block transition-transform duration-700 ease-out",
                showTitle ? "translate-y-0" : "translate-y-full"
              )}>
                Stay Ahead of&nbsp;
              </span>
            </span>
            <span className="relative inline-block">
              <span className={cn(
                "absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-lg transition-all duration-700",
                showHighlight ? "opacity-100" : "opacity-0"
              )} />
              <span className={cn(
                "relative inline-block transition-all duration-700",
                showTitle ? "translate-y-0" : "translate-y-full",
                showHighlight ? "bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent" : "text-gray-900"
              )}>
                Food Commodity Markets
              </span>
            </span>
            <span className="inline-flex items-center">
              <span className={cn(
                "inline-block transition-transform duration-700 ease-out delay-100 ml-1",
                showTitle ? "translate-y-0" : "translate-y-full"
              )}>
                with Data-Driven Forecasting
              </span>
              <div className="relative flex h-2 w-2 ml-1 translate-y-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </div>
            </span>
          </h1>
        </div>

        <div className="h-[72px] mt-8">
          <p className={cn(
            "text-lg text-gray-600 max-w-2xl transition-all duration-1000 delay-200",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            Transform food market uncertainty into reliable, real-time forecasts using best-in-class methods to enhance procurement strategies.
          </p>
        </div>
      </div>

      <div className={cn(
        "relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-2xl mx-auto transition-all duration-1000 delay-400",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <div className="flex-1">
          <Link to="/auth?tab=signup">
            <Button 
              size="lg" 
              className="w-full h-[50px] rounded-[12px] bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-[15px] font-semibold">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          <p className="text-[12px] text-center font-medium text-teal-900/70 mt-2">
            14-day free trial • Full premium access
          </p>
        </div>

        <div className="flex-1">
          <Link to="/schedule">
            <Button 
              variant="outline"
              size="lg"
              className={cn(
                "w-full h-[50px] rounded-[12px]",
                "border-2 border-teal-600/20 hover:border-teal-600/40",
                "bg-white/80 backdrop-blur-sm hover:bg-teal-50/50",
                "transition-all duration-300",
                "group relative overflow-hidden"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-[15px] font-semibold text-teal-700">
                Schedule an online coffee
                <Coffee className={cn(
                  "h-4 w-4 transition-all duration-500",
                  isHovered ? "rotate-12 scale-110" : ""
                )} />
              </span>
            </Button>
          </Link>
          <p className="text-[12px] text-center font-medium text-teal-900/70 mt-2">
            Completely free • No strings attached
          </p>
        </div>
      </div>
    </div>
  );
}