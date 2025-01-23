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
      if (!user) throw new Error('Not authenticated');

      // Get all commodities
      const { data: allCommodities, error: commoditiesError } = await supabase
        .from('commodities')
        .select('*')
        .order('name');

      if (commoditiesError) throw commoditiesError;

      // Get user's active commodities
      const { data: userPortfolio, error: portfolioError } = await supabase
        .from('commodity_portfolio')
        .select(`
          commodity_id,
          status,
          added_at,
          last_viewed_at,
          commodities (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (portfolioError) throw portfolioError;

      setCommodities(allCommodities);
      setUserCommodities(userPortfolio?.map(item => ({
        ...item.commodities,
        status: item.status,
        added_at: item.added_at,
        last_viewed_at: item.last_viewed_at
      })) || []);
    } catch (err: any) {
      console.error('Error fetching commodities:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodities();

    // Subscribe to ALL relevant changes
    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'commodity_portfolio' 
      }, () => {
        // Immediately fetch updated data when portfolio changes
        fetchCommodities();
      })
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