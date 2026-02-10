import 'server-only'

import { verifySession } from '@/dal/session'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithPersonalDataAndExperienceAndWallet = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*), experience(*), wallet(*)')
    .single()
  // .setHeader('Cache-Control', 'no-cache')
  if (error) throw new Error('Database error', { cause: error.message })
  return {
    ...data,
    experience: data.experience ? parseExperience(data.experience) : null,
  }
}
