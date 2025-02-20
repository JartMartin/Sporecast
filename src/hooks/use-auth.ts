import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

interface CompanyRegistrationData {
  name: string;
  industry: string;
  admin: {
    full_name: string;
    email: string;
    password: string;
    company_role: string;
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message !== 'Session from session_id claim in JWT does not exist') {
            console.error('Auth error:', error);
          }
        }
        
        if (mounted) {
          setUser(session?.user || null);
          setIsAuthenticated(!!session);
        }
      } catch (error: any) {
        if (error.message !== 'Session from session_id claim in JWT does not exist') {
          console.error('Auth error:', error);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user || null);
        setIsAuthenticated(!!session);

        if (event === 'SIGNED_IN') {
          navigate('/dashboard', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const registerCompany = async (data: CompanyRegistrationData) => {
    try {
      // 1. Create company first
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          industry: data.industry
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.admin.email,
        password: data.admin.password,
        options: {
          data: {
            full_name: data.admin.full_name,
            company_role: data.admin.company_role,
            company_id: companyData.id
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');

      // 3. Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.admin.full_name,
          company_id: companyData.id,
          company_role: 'admin'
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      return { data: authData, error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    signOut,
    registerCompany,
    signIn
  };
}