import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { SporecastLogo } from "@/components/sporecast-logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models for market predictions",
    href: "/features#ai-analysis",
  },
  {
    title: "Real-Time Insights",
    description: "Instant market updates and alerts",
    href: "/features#real-time",
  },
  {
    title: "Risk Management",
    description: "Comprehensive tools for risk assessment",
    href: "/features#risk",
  },
];

export function MainNav() {
  const location = useLocation();

  return (
    <nav className={cn(
      "sticky top-0 w-full z-50 transition-all duration-300",
      "bg-white/80 backdrop-blur-md shadow-sm",
      "border-b border-teal-100"
    )}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <SporecastLogo />

          <NavigationMenu className="hidden md:flex mx-6">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-gray-600 hover:text-gray-900",
                    "data-[state=open]:bg-teal-50 data-[state=open]:text-teal-900"
                  )}
                >
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {features.map((feature) => (
                      <li key={feature.title}>
                        <div
                          onClick={() => window.location.href = feature.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none outline-none transition-colors hover:bg-teal-50 hover:text-teal-900 cursor-pointer"
                        >
                          <div className="text-sm font-medium">{feature.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div
                  onClick={() => window.location.href = '/pricing'}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 cursor-pointer",
                    location.pathname === "/pricing" && "bg-teal-50 text-teal-900"
                  )}
                >
                  Pricing
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div
                  onClick={() => window.location.href = '/commodities'}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 cursor-pointer",
                    location.pathname === "/commodities" && "bg-teal-50 text-teal-900"
                  )}
                >
                  Commodity Catalog
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div
                  onClick={() => window.location.href = '/story'}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-600 hover:text-gray-900 cursor-pointer",
                    location.pathname === "/story" && "bg-teal-50 text-teal-900"
                  )}
                >
                  Our Story
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2 ml-auto">
            <Link to="/auth">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-teal-50"
              >
                Log in
              </Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}