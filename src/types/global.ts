import { Database as DB } from '@/lib/supabase/types/database.types'

declare global {
  type Database = DB
}
