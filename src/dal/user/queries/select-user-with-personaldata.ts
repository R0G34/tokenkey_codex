import 'server-only'

import { verifySession } from '@/dal/session'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithPersonalData = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*)')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return data
}
