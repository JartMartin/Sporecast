import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CommodityDashboard } from "./components/commodity-dashboard";
import { Commodity, Forecast } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function DynamicCommodityPage() {
  const { commodityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [commodity, setCommodity] = useState<Commodity | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get commodity details
        const { data: commodityData, error: commodityError } = await supabase
          .from('commodities')
          .select('*')
          .eq('id', commodityId)
          .single();

        if (commodityError) throw commodityError;

        // Check if user has access to this commodity
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('commodity_portfolio')
          .select('status')
          .eq('user_id', user.id)
          .eq('commodity_id', commodityId)
          .eq('status', 'active')
          .single();

        if (portfolioError || !portfolioData) {
          navigate('/dashboard/store');
          return;
        }

        // Get forecast data
        const { data: forecastData, error: forecastError } = await supabase
          .from('forecasts')
          .select('*')
          .eq('commodity_id', commodityId)
          .order('date', { ascending: true });

        if (forecastError) throw forecastError;

        setCommodity(commodityData);
        setForecasts(forecastData || []);
      } catch (error: any) {
        console.error('Error fetching commodity data:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate('/dashboard/store');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [commodityId, navigate, toast]);

  const handleUnsubscribe = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('commodity_portfolio')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('commodity_id', commodityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully unsubscribed from ${commodity?.name}.`,
      });

      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!commodity) {
    return null;
  }

  return (
    <CommodityDashboard
      commodity={commodity}
      forecasts={forecasts}
      onUnsubscribe={handleUnsubscribe}
    />
  );
}

export default DynamicCommodityPage;