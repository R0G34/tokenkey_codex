import 'server-only'

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'
import { parseAttachments } from '@/utils/supabase/parse-attachments'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectMessages = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error('Database error', { cause: error.message })
  return data.map((msg) => ({
    ...msg,
    attachments: msg.attachments ? parseAttachments(msg.attachments) : null,
  }))
}

export const updateMessage = async (
  messageId: Tables<'message'>['id'],
  values: TablesUpdate<'message'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('message')
    .update(values)
    .eq('id', messageId)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const insertMessage = async (values: TablesInsert<'message'>) => {
  const supabase = createAdminClient()
  const { error } = await supabase.from('message').insert(values).select('*')
  if (error) throw new Error('Database error', { cause: error.message })
}
