'use client'

import { getErrorMessage } from '@/utils/error/get-error-message'
import { shutdown } from '@intercom/messenger-js-sdk'
import { signOut as nextAuthSignOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useSignOut = () => {
  const t = useTranslations('auth')

  const signOut = async () => {
    try {
      await nextAuthSignOut({ callbackUrl: '/' /* , redirect: true */ })
      shutdown()
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(t('signOut.toast.error'), { description: message })
    }
  }

  return { signOut }
}
