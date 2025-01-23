import { useState, useEffect } from 'react';
import { Alert } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('commodity_alerts')
        .select(`
          id,
          commodity_id,
          type,
          threshold,
          is_active,
          created_at,
          commodities (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      console.error('Error fetching alerts:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('commodity_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alert Deleted",
        description: "The alert has been removed successfully.",
      });

      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error: any) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Subscribe to alert changes
    const subscription = supabase
      .channel('alert_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'commodity_alerts' 
      }, fetchAlerts)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    alerts,
    loading,
    error,
    deleteAlert,
    refreshAlerts: fetchAlerts
  };
}