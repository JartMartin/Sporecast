import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useCommodities } from "@/hooks/use-commodities";
import { TypingGreeting } from "@/features/dashboard/shared/components/typing-greeting";
import { EmptyPortfolio } from "@/features/dashboard/shared/components/empty-portfolio";
import PortfolioTable from "./components/portfolio-table";
import { PortfolioHeader } from "./components/portfolio-header";
import { CommodityExplorer } from "./components/commodity-explorer";
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

      {/* Commodity Explorer Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Commodity Explorer</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Compare your commodities with recommended alternatives
            </p>
          </div>
        </div>

        <CommodityExplorer
          selectedCommodity={{
            name: "Milling Wheat / Blé de Meunerie",
            marketCode: "MWT",
            currentPrice: 201.48,
            volume: {
              amount: 46.53,
              unit: "K",
              change: 8
            }
          }}
        />
      </div>
    </div>
  );
}

export { DashboardHome };
export default DashboardHome;