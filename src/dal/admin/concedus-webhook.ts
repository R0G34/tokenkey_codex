import 'server-only'

import { Tables, TablesInsert } from '@/lib/supabase/types/database.types'
import { webhookEventSchema } from '@/services/concedus/schema'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Uses admin client since this is called from webhook (no user session).
 * Returns inserted rows for further processing.
 */
export const adminInsertConcedusWebhookEvents = async (
  values: TablesInsert<'concedus_webhook'>[],
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('concedus_webhook')
    .insert(values)
    .select()
  if (error) throw new Error('Database error', { cause: error.message })
  return data.map((row) => ({
    ...row,
    event: webhookEventSchema.parse(row.event),
  }))
}

/**
 * Update webhook status after processing.
 */
export const adminUpdateConcedusWebhookStatus = async (
  id: number,
  status: Tables<'concedus_webhook'>['status'],
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('concedus_webhook')
    .update({ status })
    .eq('id', id)
  if (error) throw new Error('Database error', { cause: error.message })
}
