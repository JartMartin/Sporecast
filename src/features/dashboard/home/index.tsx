import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useCommodities } from "@/hooks/use-commodities";
import { TypingGreeting } from "@/features/dashboard/shared/components/typing-greeting";
import { EmptyPortfolio } from "@/features/dashboard/shared/components/empty-portfolio";
import { PortfolioTable } from "./components/portfolio-table";
import { PortfolioHeader } from "./components/portfolio-header";
import { Loading3D } from "@/components/ui/loading-3d";

function DashboardHome() {
  const { profile, loading: profileLoading } = useProfile();
  const { userCommodities, loading: commoditiesLoading } = useCommodities();

  if (profileLoading || commoditiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading3D />
      </div>
    );
  }

  if (userCommodities.length === 0) {
    return (
      <div className="space-y-8">
        <TypingGreeting />
        <EmptyPortfolio />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TypingGreeting />

      <div className="space-y-6">
        <PortfolioHeader totalCommodities={userCommodities.length} />
        <PortfolioTable items={userCommodities} />
      </div>
    </div>
  );
}

export { DashboardHome };
export default DashboardHome;