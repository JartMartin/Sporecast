import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AddCommodityDialog } from "./components/add-commodity-dialog";
import { RequestDialog } from "./components/request-dialog";
import { CommodityCard } from "./components/commodity-card";

interface Commodity {
  id: string;
  name: string;
  category: string;
  status: "available" | "portfolio" | "coming-soon";
  market_code: string;
  exchange: string;
}

export function CommodityStore() {
  const [showRequestForm, setShowRequestForm] = useState(false);
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

        // Get all commodities
        const { data: allCommodities, error: commoditiesError } = await supabase
          .from('commodities')
          .select('*')
          .order('name');

        if (commoditiesError) throw commoditiesError;

        // Get user's active commodities
        const { data: userCommodities, error: userError } = await supabase
          .from('commodity_portfolio')
          .select('commodity_id')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (userError) throw userError;

        // Create a Set of user's commodity IDs for faster lookup
        const userCommodityIds = new Set(userCommodities?.map(uc => uc.commodity_id) || []);

        // Map commodities with portfolio status
        const mappedCommodities = allCommodities.map(commodity => ({
          id: commodity.id,
          name: commodity.name,
          category: commodity.category || 'Other',
          market_code: commodity.market_code,
          exchange: commodity.exchange,
          status: userCommodityIds.has(commodity.id)
            ? 'portfolio'
            : commodity.status === 'coming-soon'
              ? 'coming-soon'
              : 'available'
        }));

        setCommodities(mappedCommodities);
      } catch (error: any) {
        console.error('Error fetching commodities:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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

  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommodities = filteredCommodities.reduce((acc, commodity) => {
    const category = commodity.status === "coming-soon" ? "Coming Soon" : commodity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(commodity);
    return acc;
  }, {} as Record<string, Commodity[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
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
          Browse and add commodities to your portfolio
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commodities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          className="gap-2 whitespace-nowrap"
          onClick={() => setShowRequestForm(true)}
        >
          <Plus className="h-4 w-4" /> Request Commodity
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedCommodities).map(([category, commodities]) => (
          commodities.length > 0 && (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {commodities.map((commodity) => (
                  <CommodityCard 
                    key={commodity.id} 
                    commodity={commodity}
                    onSelect={setSelectedCommodity}
                  />
                ))}
              </div>
            </div>
          )
        ))}
        
        {filteredCommodities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No commodities found matching your search.</p>
          </div>
        )}
      </div>

      <AddCommodityDialog
        open={!!selectedCommodity}
        onOpenChange={() => setSelectedCommodity(null)}
        commodityId={selectedCommodity?.id || ''}
        commodityName={selectedCommodity?.name || ''}
      />

      <RequestDialog
        open={showRequestForm}
        onOpenChange={setShowRequestForm}
      />
    </div>
  );
}

export default CommodityStore;