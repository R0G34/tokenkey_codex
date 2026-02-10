import 'server-only'

import { verifySession } from '@/dal/session'
import { createClient } from '@/utils/supabase/server'
import { getLocale } from 'next-intl/server'

export const selectProjectWithDetailsByCode = async (code: string) => {
  const locale = await getLocale()
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('project')
    .select(
      '*, images:project_image(*), translations:project_translation(*), documents:project_document(*), optins:optin(*), optinSummary:project_optin_summary(*)',
    )
    .neq('status', 'Cancelled')
    .eq('code', code.toUpperCase())
    .eq('translations.locale', locale)
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
