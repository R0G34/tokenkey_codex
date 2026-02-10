import 'server-only'

import { verifySession } from '@/dal/session'
import { parseCompany } from '@/utils/supabase/parse-company'
import { parsePersonalData } from '@/utils/supabase/parse-personal-data'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithCompanyAndPersonalDataAndBankAccount = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, company(*), personal_data(*), bank_account(*)')
    .single()
  // .setHeader('Cache-Control', 'no-cache')
  if (error) throw new Error('Database error', { cause: error.message })
  return {
    ...data,
    company: data.company ? parseCompany(data.company) : null,
    personal_data: data.personal_data
      ? parsePersonalData(data.personal_data)
      : null,
  }
}
