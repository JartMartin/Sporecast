import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Commodity, PortfolioCommodity } from '@/lib/types';
import { useToast } from './use-toast';

export function useCommodities() {
  const [loading, setLoading] = useState(true);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [userCommodities, setUserCommodities] = useState<PortfolioCommodity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCommodities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If not authenticated, just set empty arrays without error
        setCommodities([]);
        setUserCommodities([]);
        return;
      }

      // Use the active_user_commodities view for better performance
      const { data: activeCommodities, error: viewError } = await supabase
        .from('active_user_commodities')
        .select('*')
        .order('name');

      if (viewError) throw viewError;

      // Get all available commodities
      const { data: allCommodities, error: commoditiesError } = await supabase
        .from('commodities')
        .select('*')
        .order('name');

      if (commoditiesError) throw commoditiesError;

      setCommodities(allCommodities);
      setUserCommodities(activeCommodities?.map(item => ({
        ...item,
        status: 'active',
      })) || []);
    } catch (err: any) {
      // Only show error toast for unexpected errors
      if (err.message !== 'Not authenticated') {
        console.error('Error fetching commodities:', err);
        setError(err.message);
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

  useEffect(() => {
    fetchCommodities();

    // Subscribe to portfolio changes
    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'commodity_portfolio' 
      }, fetchCommodities)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    loading,
    error,
    commodities,
    userCommodities,
    refreshCommodities: fetchCommodities
  };
}