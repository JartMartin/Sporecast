import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight, AlertTriangle, Loader2, TrendingUp, LineChart } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { TypingGreeting } from "./components/typing-greeting";
import { EmptyPortfolio } from "./components/empty-portfolio";
import { PortfolioGrid } from "./components/portfolio-grid";
import { PortfolioHeader } from "./components/portfolio-header";
import { StatCard } from "@/components/dashboard/stat-card";

interface PortfolioStats {
  totalCommodities: number;
  activeCommodities: number;
  recentlyViewed: {
    id: string;
    name: string;
    symbol: string;
    market_code: string;
    exchange: string;
    lastViewed: string;
  }[];
}

export function DashboardHome() {
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPortfolioStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Authentication required");
          return;
        }

        const { data: portfolioData, error: portfolioError } = await supabase
          .from('commodity_portfolio')
          .select(`
            commodity_id,
            status,
            last_viewed_at,
            commodities (
              id,
              name,
              symbol,
              market_code,
              exchange
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('last_viewed_at', { ascending: false });

        if (portfolioError) {
          console.error('Portfolio fetch error:', portfolioError);
          throw new Error('Failed to fetch portfolio data');
        }

        const stats: PortfolioStats = {
          totalCommodities: portfolioData?.length || 0,
          activeCommodities: portfolioData?.length || 0,
          recentlyViewed: portfolioData
            ?.filter(item => item.last_viewed_at && item.commodities)
            .map(item => ({
              id: item.commodities.id,
              name: item.commodities.name,
              symbol: item.commodities.symbol,
              market_code: item.commodities.market_code,
              exchange: item.commodities.exchange,
              lastViewed: new Date(item.last_viewed_at).toLocaleDateString()
            })) || []
        };

        setStats(stats);
      } catch (error: any) {
        console.error('Error fetching portfolio stats:', error);
        setError(error.message || 'Failed to load portfolio data');
        toast({
          title: "Error",
          description: error.message || 'Failed to load portfolio data',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchPortfolioStats();
    }

    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'commodity_portfolio' 
      }, fetchPortfolioStats)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [profile, toast]);

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-500">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats || stats.totalCommodities === 0) {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Commodities"
          value={stats.activeCommodities}
          icon={<Store className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Portfolio Value"
          value="€99/mo"
          description={`per commodity`}
          icon={<TrendingUp className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Next Billing"
          value={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          icon={<LineChart className="h-6 w-6 text-teal-600" />}
        />
      </div>

      <div className="space-y-6">
        <PortfolioHeader totalCommodities={stats.totalCommodities} />
        <PortfolioGrid items={stats.recentlyViewed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/dashboard/store">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Store className="h-4 w-4" />
                Browse Commodity Store
              </Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertTriangle className="h-4 w-4" />
                Update Notification Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHome;