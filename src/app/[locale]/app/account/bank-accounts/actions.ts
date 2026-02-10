'use server'

import {
  insertBankAccount,
  updateBankAccountAsDefault,
} from '@/dal/bank-account'
import { TablesInsert } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { revalidatePath } from 'next/cache'

/**
 * Set a bank account as the default
 */
export async function setDefaultBankAccount(iban: string) {
  try {
    await updateBankAccountAsDefault(iban)

    revalidatePath('/app/account')
    revalidatePath('/app/account/bank-accounts')

    return { data: true, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

/**
 * Add a new bank account
 */
export async function addBankAccount(
  values: Omit<TablesInsert<'bank_account'>, 'user_id'>,
) {
  try {
    await insertBankAccount(values)

    revalidatePath('/app/account')
    revalidatePath('/app/account/bank-accounts')

    return { data: true, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}
