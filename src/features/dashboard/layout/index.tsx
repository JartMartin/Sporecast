import { Outlet } from "react-router-dom";
import { NavSidebar } from "../shared/components/nav-sidebar";
import { SporaChat } from "../shared/components/spora-chat";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { LoadingPage } from "@/components/ui/loading-page";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function DashboardLayout() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-teal-100 px-4 h-16 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex">
        <NavSidebar 
          onCollapsedChange={setIsNavCollapsed}
          isMobileOpen={isMobileNavOpen}
          onMobileOpenChange={setIsMobileNavOpen}
        />
        <main 
          className={cn(
            "flex-1 min-h-screen transition-all duration-200 ease-in-out",
            "p-4 lg:p-10",
            "lg:ml-64",
            isNavCollapsed && "lg:ml-16",
            // Add top padding for mobile to account for the menu button
            "pt-20 lg:pt-10"
          )}
        >
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingPage />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <SporaChat />
    </div>
  );
}

export { DashboardLayout };
export default DashboardLayout;