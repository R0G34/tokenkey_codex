import 'server-only'

import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { parseAttachments } from '@/utils/supabase/parse-attachments'
import { createClient } from '@/utils/supabase/server'

export const selectMessageById = async (id: Tables<'message'>['id']) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
    ? {
        ...data,
        attachments: data.attachments
          ? parseAttachments(data.attachments)
          : null,
      }
    : null
}
