import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(`[Env Error]: Missing ${!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SUPABASE_URL' : 'SUPABASE_ANON_KEY'}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);