import 'server-only'

import { Tables, TablesInsert } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'
import { Locale } from 'next-intl'

export const adminInsertWallet = async ({
  address,
  type,
  user_id,
  web3auth_user_info,
}: TablesInsert<'wallet'>) => {
  const supabase = createAdminClient()
  const { error } = await supabase.from('wallet').insert({
    address,
    type,
    user_id,
    web3auth_user_info,
  })
  if (error) throw new Error('Database error', { cause: error.message })
}

export const adminUpdateUserLocale = async (
  userId: Tables<'user'>['id'],
  locale: Tables<'user'>['locale'],
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('user')
    .update({ locale })
    .eq('id', userId)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const adminSelectUserLocaleAndKyc = async (
  userId: Tables<'user'>['id'],
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('user')
    .select('locale, personal_data(kyc)')
    .eq('id', userId)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return { ...data, locale: data.locale as Locale }
}

export const adminCountUserByEmail = async (email: Tables<'user'>['email']) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('user')
    .select('count')
    .eq('email', email)
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data?.count ?? 0
}
