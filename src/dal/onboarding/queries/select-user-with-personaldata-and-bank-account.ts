import 'server-only'

import { verifySession } from '@/dal/session'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithPersonalDataAndBankAccount = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*), bank_account(*)')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
