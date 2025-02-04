import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sporecast-auth',
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  global: {
    headers: {
      'x-client-info': 'sporecast-web'
    }
  }
});

// Helper to handle Supabase errors
export function handleSupabaseError(error: any): string | null {
  if (!error) return null;
  
  if (error.message === 'Failed to fetch') {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  if (error.code === 'PGRST116' || error.code === '406') {
    // Not an error - just means no rows found
    return null;
  }
  
  if (error.code === 'PGRST301') {
    return 'Database connection error. Please try again later.';
  }

  if (error.code === '23505') {
    return 'This alert already exists.';
  }

  if (error.code === '22P02') {
    return 'Invalid data format. Please check your input and try again.';
  }
  
  return error.message || 'An unexpected error occurred';
}

// Helper to safely execute Supabase queries with retries
export async function safeQuery<T>(
  query: Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000
): Promise<{ data: T | null; error: string | null }> {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await query;
      
      if (error) {
        const errorMessage = handleSupabaseError(error);
        if (errorMessage) {
          console.warn(`Query attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          return { data: null, error: errorMessage };
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Query attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return { data: null, error: handleSupabaseError(error) || 'Failed to complete request' };
    }
  }
  
  return { data: null, error: 'Failed to complete request after multiple attempts' };
}

// Helper to initialize user profile
export async function initializeUserProfile(userId: string, userData: {
  full_name: string;
  role: string;
  company: string;
  email: string;
}) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: userData.full_name.trim(),
        role: userData.role,
        company: userData.company.trim(),
        email: userData.email.trim(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error initializing profile:', error);
    return { error: handleSupabaseError(error) || 'Failed to initialize profile' };
  }
}

// Helper to check connection with retries
export async function checkSupabaseConnection(retries = 3, delay = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase.from('profiles').select('count');
      if (!error) return true;
      
      console.warn(`Connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}