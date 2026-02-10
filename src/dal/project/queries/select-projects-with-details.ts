import 'server-only'

import { createClient } from '@/utils/supabase/server'
import { Locale } from 'next-intl'

export const selectProjectsWithDetails = async (locale: Locale) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project')
    .select(
      '*, images:project_image(*), translations:project_translation(*), optinSummary:project_optin_summary(*)',
    )
    .neq('status', 'Cancelled')
    .eq('translations.locale', locale)
    .order('id')
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
