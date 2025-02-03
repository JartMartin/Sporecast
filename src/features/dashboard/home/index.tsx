import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useCommodities } from "@/hooks/use-commodities";
import { TypingGreeting } from "@/features/dashboard/shared/components/typing-greeting";
import { EmptyPortfolio } from "@/features/dashboard/shared/components/empty-portfolio";
import PortfolioTable from "./components/portfolio-table";
import { PortfolioHeader } from "./components/portfolio-header";
import { Loading3D } from "@/components/ui/loading-3d";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Sprout, Zap } from "lucide-react";
import { Link } from "react-router-dom";

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

      {/* Recommended Commodities */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
            Recommended Commodities for you
          </h2>
          <Link to="/dashboard/store">
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Maize Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Maize / Corn</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">ZC</span>
                  <span className="text-xs text-muted-foreground">CME</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-lg font-semibold">€185.75</div>
              <div className="text-sm text-emerald-600">+1.8% last week</div>
            </div>
            <Link to="/dashboard/store">
              <Button className="w-full gap-2">
                Add to Portfolio <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Barley Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Barley</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">BAR</span>
                  <span className="text-xs text-muted-foreground">Euronext</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-lg font-semibold">€160.25</div>
              <div className="text-sm text-emerald-600">+2.1% last week</div>
            </div>
            <Link to="/dashboard/store">
              <Button className="w-full gap-2">
                Add to Portfolio <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Oats Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Oats</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">ZO</span>
                  <span className="text-xs text-muted-foreground">CME</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-lg font-semibold">€140.50</div>
              <div className="text-sm text-emerald-600">+1.5% last week</div>
            </div>
            <Link to="/dashboard/store">
              <Button className="w-full gap-2">
                Add to Portfolio <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Trending Commodities */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
            Trending Commodities
          </h2>
          <Link to="/dashboard/store">
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Soybean Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Soybean</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">ZS</span>
                  <span className="text-xs text-muted-foreground">CME</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Coming Soon</div>
              <div className="text-sm">Join the waitlist to get notified when available</div>
            </div>
            <Link to="/dashboard/store">
              <Button variant="outline" className="w-full gap-2">
                Join Waitlist <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Coffee Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Coffee</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">KC</span>
                  <span className="text-xs text-muted-foreground">ICE</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Coming Soon</div>
              <div className="text-sm">Join the waitlist to get notified when available</div>
            </div>
            <Link to="/dashboard/store">
              <Button variant="outline" className="w-full gap-2">
                Join Waitlist <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Sugar Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Sugar</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">SB</span>
                  <span className="text-xs text-muted-foreground">ICE</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Coming Soon</div>
              <div className="text-sm">Join the waitlist to get notified when available</div>
            </div>
            <Link to="/dashboard/store">
              <Button variant="outline" className="w-full gap-2">
                Join Waitlist <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { DashboardHome };
export default DashboardHome;