'use server'

import { updateMessage } from '@/dal/message'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { revalidatePath } from 'next/cache'

export async function markAsRead(messageId: Tables<'message'>['id']) {
  try {
    await updateMessage(messageId, { read: true })
    revalidatePath('/app/inbox', 'layout')
    return { data: null, error: null }
  } catch (error) {
    console.error('Error in markAsRead:', error)
    return { data: null, error: getErrorMessage(error) }
  }
}
