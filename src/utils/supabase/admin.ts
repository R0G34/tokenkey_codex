import { Database } from '@/lib/supabase/types/database.types'
import { createClient } from '@supabase/supabase-js'

// https://github.com/orgs/supabase/discussions/20790#discussioncomment-8265329

// https://supabase.com/docs/reference/javascript/admin-api
// Access auth admin api: const adminAuthClient = supabase.auth.admin

// https://github.com/orgs/supabase/discussions/15860

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
      // global: {
      //   headers: {
      //     'Cache-Control': 'no-store',
      //   },
      // },
    },
  )
