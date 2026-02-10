import 'server-only'

import { verifySession } from '@/dal/session'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithPersonalDataAndExperienceAndWalletAndBankAccount =
  async () => {
    const session = await verifySession()
    const supabase = await createClient(session.supabaseAccessToken)
    const { data, error } = await supabase
      .from('user')
      .select(
        'id, personal_data(*), experience(*), wallet(*), bankAccount:bank_account(*)',
      )
      .eq('bank_account.status', 'verified')
      .order('updated_at', {
        ascending: true,
        referencedTable: 'bank_account',
      })
      .single()
    if (error) throw new Error('Database error', { cause: error.message })
    return {
      ...data,
      experience: data.experience ? parseExperience(data.experience) : null,
    }
  }
