import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AddCommodityDialog } from "./components/add-commodity-dialog";
import { Loading3D } from "@/components/ui/loading-3d";

interface Commodity {
  id: string;
  name: string;
  category: string;
  status: "available" | "portfolio" | "coming-soon";
  market_code: string;
  exchange: string;
}

export function CommodityStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get Wheat Futures commodity
        const { data: wheatCommodity, error: commodityError } = await supabase
          .from('commodities')
          .select('*')
          .eq('symbol', 'WHEAT')
          .single();

        if (commodityError) {
          if (commodityError.code === 'PGRST116') {
            // No data found - this is expected for new users
            setCommodities([]);
            setLoading(false);
            return;
          }
          throw commodityError;
        }

        // Check if user has this commodity in portfolio
        const { data: portfolioItem, error: portfolioError } = await supabase
          .from('commodity_portfolio')
          .select('status')
          .eq('user_id', user.id)
          .eq('commodity_id', wheatCommodity.id)
          .eq('status', 'active')
          .maybeSingle();

        if (portfolioError && portfolioError.code !== 'PGRST116') {
          throw portfolioError;
        }

        // Map commodity with portfolio status
        const mappedCommodity = {
          id: wheatCommodity.id,
          name: "Milling Wheat / Blé de Meunerie",
          category: wheatCommodity.category,
          market_code: "EBM",
          exchange: "Euronext",
          status: portfolioItem ? 'portfolio' : 'available'
        };

        setCommodities([mappedCommodity]);
      } catch (error: any) {
        console.error('Error fetching commodity:', error);
        
        // Only show error toast for unexpected errors
        if (error.message !== 'Not authenticated') {
          toast({
            title: "Error",
            description: "Failed to load commodities. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to portfolio changes
    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'commodity_portfolio' 
      }, fetchData)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading3D />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
        >
          <ChevronLeft className="h-4 w-4" /> Back to My Portfolio
        </Link>
        <h1 className="text-3xl font-bold">Commodity Store</h1>
        <p className="text-muted-foreground">
          Add Milling Wheat to your portfolio to access real-time forecasts and insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {commodities.map((commodity) => (
          <Card key={commodity.id} className="flex flex-col">
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{commodity.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                      {commodity.market_code}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {commodity.exchange}
                    </span>
                  </div>
                </div>
                {commodity.status === "portfolio" && (
                  <span className="flex-shrink-0 text-xs font-medium bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                    Added
                  </span>
                )}
              </div>
              <Button
                className="w-full mt-auto"
                variant={commodity.status === "portfolio" ? "outline" : "default"}
                size="sm"
                disabled={commodity.status !== "available"}
                onClick={() => {
                  if (commodity.status === "available") {
                    setSelectedCommodity(commodity);
                  }
                }}
              >
                {commodity.status === "portfolio"
                  ? "In Portfolio"
                  : "Add to Portfolio"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AddCommodityDialog
        open={!!selectedCommodity}
        onOpenChange={() => setSelectedCommodity(null)}
        commodityId={selectedCommodity?.id || ''}
        commodityName={selectedCommodity?.name || ''}
      />
    </div>
  );
}

export default CommodityStore;