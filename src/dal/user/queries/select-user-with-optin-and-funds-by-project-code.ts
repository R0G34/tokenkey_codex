import 'server-only'

import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithOptinAndFundsByProjectCode = async (
  projectCode: Tables<'project'>['code'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('id, funds:user_funds(*), optin(*, project!inner(code))')
    .eq('optin.project.code', projectCode.toUpperCase())
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return data
}
