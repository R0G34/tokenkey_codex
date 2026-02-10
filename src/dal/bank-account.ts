import 'server-only'

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectBankAccounts = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.from('bank_account').select('*')
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const selectBankAccountByIban = async (
  iban: TablesInsert<'bank_account'>['iban'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('bank_account')
    .select('*')
    .eq('iban', iban)
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const insertBankAccountWithSelect = async (
  values: TablesInsert<'bank_account'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('bank_account')
    .insert(values)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const upsertBankAccount = async (
  values: TablesInsert<'bank_account'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('bank_account')
    .upsert(values)
    .eq('user_id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const updateBankAccount = async (
  iban: Tables<'bank_account'>['iban'],
  verificationAmount: NonNullable<
    Tables<'bank_account'>['verification_amount']
  >,
  values: TablesUpdate<'bank_account'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('bank_account')
    .update(values)
    .eq('iban', iban)
    .eq('verification_amount', verificationAmount)
    .eq('status', 'pending')
    .select('iban')
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

/**
 * Insert a new bank account and set it as default.
 * Unsets is_default on all other accounts for the user.
 */
export const insertBankAccountAsDefault = async (
  values: Omit<TablesInsert<'bank_account'>, 'is_default' | 'user_id'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)

  // Unset is_default on all existing accounts for the user
  await supabase
    .from('bank_account')
    .update({ is_default: false })
    .eq('user_id', session.user.id)

  // Insert new account as default
  const { data, error } = await supabase
    .from('bank_account')
    .insert({
      ...values,
      user_id: session.user.id,
      is_default: true,
    })
    .select('*')
    .single()

  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

/**
 * Insert a new bank account.
 * If is_default is true, unsets is_default on all other accounts first.
 */
export const insertBankAccount = async (
  values: Omit<TablesInsert<'bank_account'>, 'user_id'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)

  // If setting as default, unset is_default on all existing accounts
  if (values.is_default) {
    await supabase
      .from('bank_account')
      .update({ is_default: false })
      .eq('user_id', session.user.id)
  }

  // Insert new account
  const { data, error } = await supabase
    .from('bank_account')
    .insert({
      ...values,
      user_id: session.user.id,
    })
    .select('*')
    .single()

  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

/**
 * Set an existing bank account as the default.
 * Unsets is_default on all other accounts for the user.
 */
export const updateBankAccountAsDefault = async (iban: string) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)

  // Unset is_default on all accounts for the user
  await supabase
    .from('bank_account')
    .update({ is_default: false })
    .eq('user_id', session.user.id)

  // Set the selected account as default
  const { error } = await supabase
    .from('bank_account')
    .update({ is_default: true })
    .eq('user_id', session.user.id)
    .eq('iban', iban)

  if (error) throw new Error('Database error', { cause: error.message })
}
