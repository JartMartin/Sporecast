import { useState } from "react";
import { Brain, Clock, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Advanced Neural Networks",
    description: "Analyzing 20+ years of data to provide accurate market predictions with continuous learning capabilities.",
  },
  {
    icon: Clock,
    title: "Real-time Forecasting",
    description: "Get instant predictions and market insights as conditions change.",
  },
  {
    icon: Settings,
    title: "Your Market, Your Way",
    description: "Customizable dashboards and alerts tailored to your specific commodity interests and trading patterns.",
  },
  {
    icon: TrendingUp,
    title: "Full Transparency",
    description: "Clear insights into our prediction models and methodologies, building trust through openness.",
  },
];

export function WhySporecast() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <section 
      className="relative w-full overflow-hidden py-24 sm:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced Green Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/80 via-emerald-50 to-teal-50" />
        
        {/* Interactive Gradient following mouse */}
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(20, 184, 166, 0.2) 0%, rgba(16, 185, 129, 0.15) 30%, transparent 70%)`,
          }}
        />

        {/* Animated Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Edge Gradients */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Section Title */}
          <div className="inline-flex items-center rounded-full border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-1.5 mb-4">
            <span className="text-base font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Why Sporecast
            </span>
          </div>

          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Navigate Agri-Market Complexity with{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Confidence
              </span>
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "relative rounded-3xl p-8 transition-all duration-300",
                  "bg-gradient-to-br from-teal-50/90 via-emerald-50/80 to-white/70",
                  "hover:shadow-lg hover:shadow-teal-900/5",
                  "backdrop-blur-sm",
                  "overflow-hidden"
                )}>
                  {/* Animated Pattern */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    "bg-[radial-gradient(#10b98120_1px,transparent_1px)] [background-size:16px_16px]",
                    isHovered ? "opacity-100" : "opacity-0"
                  )} />

                  {/* Hover Gradient */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    "bg-gradient-to-br from-teal-100/40 via-emerald-50/30 to-transparent",
                    isHovered ? "opacity-100" : "opacity-0"
                  )} />

                  {/* Content */}
                  <div className="relative">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                      "bg-gradient-to-br from-teal-100 to-emerald-100",
                      "border border-teal-200/50",
                      isHovered && "scale-110 rotate-3 shadow-md"
                    )}>
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold leading-7 bg-gradient-to-r from-teal-900 to-emerald-900 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhySporecast;