import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Izvozimo klijenta da ga možemo koristiti u celom projektu
export const supabase = createClient(supabaseUrl, supabaseKey);