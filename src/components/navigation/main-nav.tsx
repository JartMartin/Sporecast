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
import { useEffect, useState } from "react";

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "w-full px-4 sm:px-6 lg:px-8 z-50 transition-all duration-300",
      isScrolled ? "fixed top-0 py-4" : "absolute top-6"
    )}>
      <div className="max-w-screen-xl mx-auto">
        <nav className={cn(
          "bg-white/95 rounded-xl shadow-sm border border-white/20 backdrop-blur-sm",
          "transition-all duration-300",
          isScrolled && "shadow-md"
        )}>
          <div className="flex h-16 items-center px-6">
            {/* Logo - Left */}
            <div className="flex-none">
              <SporecastLogo />
            </div>

            {/* Navigation - Center */}
            <div className="flex-1 flex justify-center">
              <NavigationMenu>
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
                            <Link
                              to={feature.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none outline-none transition-colors hover:bg-teal-50 hover:text-teal-900"
                            >
                              <div className="text-sm font-medium">{feature.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {feature.description}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/commodities"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-600 hover:text-gray-900 cursor-pointer",
                        location.pathname === "/commodities" && "bg-teal-50 text-teal-900"
                      )}
                    >
                      Commodity Catalog
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/pricing"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-600 hover:text-gray-900 cursor-pointer",
                        location.pathname === "/pricing" && "bg-teal-50 text-teal-900"
                      )}
                    >
                      Pricing
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      to="/story"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-600 hover:text-gray-900 cursor-pointer",
                        location.pathname === "/story" && "bg-teal-50 text-teal-900"
                      )}
                    >
                      Our Story
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Buttons - Right */}
            <div className="flex-none flex items-center gap-2">
              <Link to="/auth">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-teal-50"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button 
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}