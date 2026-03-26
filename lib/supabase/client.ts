import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../supabase/types';

export function createClient() {
  return createBrowserClient<Database, 'pomp'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'pomp' } }
  );
}
