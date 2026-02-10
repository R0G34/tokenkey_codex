import 'server-only'

import { verifySession } from '@/dal/session'
import { createClient } from '@/utils/supabase/server'
import { getLocale } from 'next-intl/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithOptinsAndOptinSummary = async () => {
  const session = await verifySession()
  const locale = await getLocale()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select(
      'id, optins:optin(*, project!inner(*, translations:project_translation(*))), optinSummary:user_optin_summary(*)',
    )
    .eq('optin.project.translations.locale', locale)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return data
}
