import { useState, useEffect } from 'react';
import { Alert, AlertFormData } from '@/lib/types';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAlerts([]);
        return;
      }

      const { data, error } = await supabase
        .from('commodity_alerts')
        .select(`
          id,
          commodity_id,
          type,
          threshold,
          is_active,
          email_notifications,
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
      const errorMessage = handleSupabaseError(error);
      if (errorMessage) {
        console.error('Error fetching alerts:', error);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (commodityId: string, alertData: AlertFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate inputs
      if (!commodityId || !alertData.type || typeof alertData.threshold !== 'number') {
        throw new Error('Missing required alert data');
      }

      // Validate commodity exists
      const { data: commodity, error: commodityError } = await supabase
        .from('commodities')
        .select('id')
        .eq('id', commodityId)
        .single();

      if (commodityError || !commodity) {
        throw new Error('Invalid commodity');
      }

      const { data, error } = await supabase
        .from('commodity_alerts')
        .insert({
          user_id: user.id,
          commodity_id: commodityId,
          type: alertData.type,
          threshold: alertData.threshold,
          is_active: alertData.is_active,
          email_notifications: alertData.email_notifications || false
        })
        .select(`
          id,
          commodity_id,
          type,
          threshold,
          is_active,
          email_notifications,
          created_at,
          commodities (
            name
          )
        `)
        .single();

      if (error) throw error;

      setAlerts(prev => [data, ...prev]);

      toast({
        title: "Alert Created",
        description: "Your price alert has been set successfully.",
      });

      return data;
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to create alert. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('commodity_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert Deleted",
        description: "The alert has been removed successfully.",
      });
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleEmailNotifications = async (alertId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('commodity_alerts')
        .update({ email_notifications: enabled })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, email_notifications: enabled }
          : alert
      ));

      toast({
        title: enabled ? "Email Notifications Enabled" : "Email Notifications Disabled",
        description: `You will ${enabled ? 'now' : 'no longer'} receive email notifications for this alert.`,
      });
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      console.error('Error toggling email notifications:', error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to update notification settings. Please try again.",
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
    createAlert,
    deleteAlert,
    toggleEmailNotifications,
    refreshAlerts: fetchAlerts
  };
}