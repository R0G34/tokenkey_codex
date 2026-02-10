import 'server-only'

import { verifySession } from '@/dal/session'
import { parseCompany } from '@/utils/supabase/parse-company'
import { parsePersonalData } from '@/utils/supabase/parse-personal-data'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithPersonalDataAndCompany = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*), company(*)')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return {
    ...data,
    company: data.company ? parseCompany(data.company) : null,
    personal_data: data.personal_data
      ? parsePersonalData(data.personal_data)
      : null,
  }
}
