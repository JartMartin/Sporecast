import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
        
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-75"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Decorative Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Edge Gradients */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Shape your{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Future-Focused
              </span>
            </span>
            {" "}Strategy
          </h2>

          <p className="text-xl text-gray-600">
            Make confident decisions with real-time data and insights powered by cutting-edge neural networks and deep learning. Our platform eliminates guesswork, helping you navigate market fluctuations with clarity and precision, and make smarter, data-driven choices for long-term success.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl mx-auto pt-4">
            <Link to="/auth?tab=signup" className="flex-1">
              <Button 
                size="lg" 
                className="w-full relative group overflow-hidden h-12"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  Start my free Demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-transform group-hover:scale-[1.02]" />
              </Button>
            </Link>

            <div className="hidden sm:block h-12">
              <div className="h-full w-px bg-teal-200/50" />
            </div>

            <Link to="/schedule" className="flex-1">
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
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • 14-day free trial • Full premium access
          </p>
        </div>
      </div>
    </section>
  );
}