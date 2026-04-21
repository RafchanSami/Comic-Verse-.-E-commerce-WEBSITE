import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore ReferenceError if process is not defined
  }
  return undefined;
};

/**
 * Updated Supabase Configuration
 * Project URL: https://ewgwvmdtfvjrwhuormvw.supabase.co
 */
const supabaseUrl = getEnv('REACT_APP_SUPABASE_URL') || 'https://ewgwvmdtfvjrwhuormvw.supabase.co';
const supabaseKey = getEnv('REACT_APP_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Z3d2bWR0ZnZqcndodW9ybXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDcyNDksImV4cCI6MjA4NDcyMzI0OX0.boaWE9-5x4Lt8mUPQCHq57A-_hctRhCjS_IMtkW4ejo';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});