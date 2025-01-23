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

  const addCommodity = async (commodityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already in portfolio
      const { data: existing } = await supabase
        .from('commodity_portfolio')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('commodity_id', commodityId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'active') {
          throw new Error('Commodity is already in your portfolio');
        }

        // Reactivate if inactive
        const { error: updateError } = await supabase
          .from('commodity_portfolio')
          .update({
            status: 'active',
            added_at: new Date().toISOString(),
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Add new entry
        const { error: insertError } = await supabase
          .from('commodity_portfolio')
          .insert({
            user_id: user.id,
            commodity_id: commodityId,
            status: 'active',
            last_viewed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      await fetchCommodities();
      return { error: null };
    } catch (error: any) {
      console.error('Error adding commodity:', error);
      return { error: error.message };
    }
  };

  const removeCommodity = async (commodityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('commodity_portfolio')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('commodity_id', commodityId);

      if (error) throw error;

      await fetchCommodities();
      return { error: null };
    } catch (error: any) {
      console.error('Error removing commodity:', error);
      return { error: error.message };
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
    addCommodity,
    removeCommodity,
    refreshCommodities: fetchCommodities
  };
}