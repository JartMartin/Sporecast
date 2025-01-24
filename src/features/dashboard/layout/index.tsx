import { Outlet } from "react-router-dom";
import { NavSidebar } from "../shared/components/nav-sidebar";
import { SporaChat } from "../shared/components/spora-chat";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { LoadingPage } from "@/components/ui/loading-page";

function DashboardLayout() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="flex">
        <NavSidebar onCollapsedChange={setIsNavCollapsed} />
        <main 
          className={cn(
            "flex-1 min-h-screen p-6 lg:p-10 transition-all duration-200 ease-in-out",
            "lg:ml-64",
            isNavCollapsed && "lg:ml-16"
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

// Make sure to export both as default and named export
export { DashboardLayout };
export default DashboardLayout;