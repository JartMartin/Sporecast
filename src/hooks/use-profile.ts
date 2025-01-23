import { useState, useEffect } from 'react';
import { supabase, safeQuery } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { useToast } from './use-toast';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        return;
      }

      // Get profile data with retries
      const { data, error } = await safeQuery(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
      );

      if (error) throw new Error(error);
      setProfile(data);
    } catch (err: any) {
      console.error('Profile error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await safeQuery(
        supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
      );

      if (error) throw new Error(error);

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      return { error: null };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchProfile();

    // Subscribe to profile changes
    const subscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}` 
      }, fetchProfile)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    profile, 
    loading, 
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
}