import { createClient } from '@supabase/supabase-js';

export const createSupabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon'
  );
