import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SporecastLogo } from "@/components/sporecast-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Home,
  Store,
  Bell,
  User2,
  X
} from "lucide-react";

interface NavSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

export function NavSidebar({ onCollapsedChange, isMobileOpen, onMobileOpenChange }: NavSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile nav when route changes
  useEffect(() => {
    onMobileOpenChange?.(false);
  }, [location.pathname, onMobileOpenChange]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Define navigation sections
  const navSections: NavSection[] = [
    {
      items: [
        { id: "home", icon: Home, label: "My Commodities", href: "/dashboard" },
      ]
    },
    {
      label: "Manage",
      items: [
        { id: "store", icon: Store, label: "Commodity Store", href: "/dashboard/store" },
        { id: "alerts", icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
        { id: "profile", icon: User2, label: "Profile", href: "/dashboard/profile" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onMobileOpenChange?.(false)}
        />
      )}

      <div 
        className={cn(
          "fixed top-0 bottom-0 transition-all duration-300 ease-in-out z-50",
          "backdrop-blur-lg bg-white/80 supports-[backdrop-filter]:bg-white/80",
          "border-r border-neutral-100",
          "lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          // Mobile styles
          "lg:block",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Mobile header offset
          "mt-16 lg:mt-0"
        )}
      >
        <div className="h-full relative flex flex-col">
          {/* Logo Section */}
          <div className={cn(
            "hidden lg:flex items-center h-14 px-3 transition-all duration-200",
            isCollapsed ? "justify-center" : "justify-start"
          )}>
            <SporecastLogo 
              linkToHome={false} 
              variant={isCollapsed ? "icon" : "full"}
              className="transition-all duration-200"
            />
          </div>

          {/* Close button for mobile */}
          <div className="lg:hidden absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMobileOpenChange?.(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {navSections.map((section, index) => (
              <div key={section.label || index} className="space-y-0.5">
                {!isCollapsed && section.label && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      {section.label}
                    </h3>
                  </div>
                )}
                {section.items.map(item => (
                  <NavItem key={item.id} item={item} isCollapsed={isCollapsed} />
                ))}
                {index < navSections.length - 1 && (
                  <div className="my-3">
                    <Separator className="bg-neutral-100" />
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-2 border-t border-neutral-100">
            {profile && (
              <div className={cn(
                "flex items-center gap-3 p-2 rounded-md transition-colors",
                "hover:bg-neutral-50"
              )}>
                <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium text-neutral-700">{profile.full_name}</div>
                    <div className="truncate text-xs text-neutral-500">{profile.email}</div>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full mt-1 justify-start gap-3 text-sm font-medium text-neutral-600",
                "hover:bg-neutral-50 hover:text-neutral-900",
                isCollapsed && "px-0"
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && "Sign Out"}
            </Button>
          </div>

          {/* Collapse Button - Only show on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[-12px] top-5 h-6 w-6 rounded-full border bg-white shadow-sm hover:bg-neutral-50 transition-transform duration-200 hidden lg:block"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              onCollapsedChange?.(!isCollapsed);
            }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

// Helper component for nav items
function NavItem({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const Icon = item.icon;
  
  const content = (
    <Link
      to={item.href}
      className={cn(
        "flex items-center h-9 gap-3 rounded-md px-3 transition-colors duration-200",
        "text-sm font-medium",
        isActive 
          ? "bg-teal-50 text-teal-900" 
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!isCollapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : content;
}

export default NavSidebar;