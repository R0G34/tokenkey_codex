import 'server-only'

import { verifySession } from '@/dal/session'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { parsePersonalData } from '@/utils/supabase/parse-personal-data'
import { createClient } from '@/utils/supabase/server'

export const selectUserWithPersonalDataAndExperience = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*), experience(*)')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return {
    ...data,
    experience: data.experience ? parseExperience(data.experience) : null,
    personal_data: data.personal_data
      ? parsePersonalData(data.personal_data)
      : null,
  }
}
