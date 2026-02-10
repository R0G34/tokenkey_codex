'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { Intercom } from '@intercom/messenger-js-sdk'
import { useEffect } from 'react'

interface Props {
  appId: string
  personalData: Tables<'personal_data'> | null
  user: Tables<'user'> | null
}

export function BootIntercom({ appId, personalData, user }: Props) {
  useEffect(
    () => {
      try {
        if (user) {
          Intercom({
            app_id: appId,
            created_at: new Date(user.created_at).getTime() / 1000,
            email: user.email,
            name: personalData?.forename,
            phone: personalData?.phone_number ?? undefined,
            user_id: user.id,
          })
        } else {
          Intercom({ app_id: appId })
        }
      } catch (error) {
        const message = getErrorMessage(error)
        console.error('❌ Failed to initialize Intercom:', message)
      }

      // return () => shutdown()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return null
}
