import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 * ---------------
 * Initializes a Supabase client instance for use throughout the app.
 * Uses environment variables for the Supabase URL and anon key.
 */

// Get Supabase project URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
