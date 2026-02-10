import 'server-only'

import { Tables } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'
import { Locale } from 'next-intl'

export const adminSelectTransactionWithUserById = async (
  id: Tables<'transaction'>['id'],
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('transaction')
    .select(
      'id, user!inner(email, locale, personalData:personal_data!inner(forename))',
    )
    .eq('id', id)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return { ...data, user: { ...data.user, locale: data.user.locale as Locale } }
}
