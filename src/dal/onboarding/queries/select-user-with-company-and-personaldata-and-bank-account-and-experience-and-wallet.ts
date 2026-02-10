import 'server-only'

import { verifySession } from '@/dal/session'
import { parseCompany } from '@/utils/supabase/parse-company'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { parsePersonalData } from '@/utils/supabase/parse-personal-data'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet =
  async () => {
    const session = await verifySession()
    const supabase = await createClient(session.supabaseAccessToken)
    const { data, error } = await supabase
      .from('user')
      .select(
        '*, company(*), personal_data(*), bank_account(*), experience(*), wallet(*)',
      )
      .single()
    // .setHeader('Cache-Control', 'no-cache')
    if (error) throw new Error('Database error', { cause: error.message })
    return {
      ...data,
      company: data.company ? parseCompany(data.company) : null,
      experience: data.experience ? parseExperience(data.experience) : null,
      personal_data: data.personal_data
        ? parsePersonalData(data.personal_data)
        : null,
    }
  }
