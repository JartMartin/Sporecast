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
  },
  // Add retry configuration
  db: {
    schema: 'public'
  }
});

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

// Helper to handle fetch errors
export function handleSupabaseError(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  if (error.message === 'Failed to fetch') {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  if (error.code === 'PGRST116' || error.code === '406') {
    // Not an error - just means no rows found
    return '';
  }
  
  if (error.code === 'PGRST301') {
    return 'Database connection error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred';
}

// Helper to safely execute Supabase queries with retries
export async function safeQuery<T>(
  query: Promise<{ data: T | null; error: any }>,
  defaultValue: T | null = null,
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
          return { data: defaultValue, error: errorMessage };
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Query attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      const errorMessage = handleSupabaseError(error);
      return { data: defaultValue, error: errorMessage };
    }
  }
  
  return { data: defaultValue, error: 'Failed to complete request after multiple attempts' };
}

// Helper to initialize user profile
export async function initializeUserProfile(userId: string, userData: {
  full_name: string;
  role: string;
  company: string;
  email: string;
}) {
  return safeQuery(
    supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...userData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
  );
}