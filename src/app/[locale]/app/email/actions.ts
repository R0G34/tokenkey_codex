'use server'

import { verifySession } from '@/dal/session'
import { updateUserWithSelect } from '@/dal/user'
import { EmailFormSchema } from './email-form-schema'

export async function saveEmail(data: { email: string }) {
  await verifySession()

  const { data: parsedData, error } = EmailFormSchema.safeParse(data)

  if (error) return { data: null, error: error.format() }

  // Should also update email in KYC and Nyala? For now disabled.
  const updatedUser = await updateUserWithSelect({ email: parsedData.email })

  return { data: updatedUser, error: null }
}
