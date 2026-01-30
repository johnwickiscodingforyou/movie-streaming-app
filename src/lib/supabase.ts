// src/lib/supabase.ts
// This file creates and exports the Supabase client
// We'll use this client throughout our app to interact with the database

import { createClient } from '@supabase/supabase-js';

// Get environment variables
// The ! tells TypeScript these will definitely exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client
// This client can be imported anywhere in the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is logged in
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
