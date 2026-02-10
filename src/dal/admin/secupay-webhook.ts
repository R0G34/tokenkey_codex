import 'server-only'

import { Tables, TablesInsert } from '@/lib/supabase/types/database.types'
import { webhookPayloadSchema } from '@/services/secupay/schema'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Upsert a secupay webhook event (admin/service role)
 */
export const adminUpsertSecupayWebhookEvent = async (
  values: TablesInsert<'secupay_webhook'>,
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('secupay_webhook')
    .upsert(values)
    .eq('id', values.id)
    .select()
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return webhookPayloadSchema.parse(data)
}

/**
 * Update webhook status after processing (admin/service role)
 */
export const adminUpdateSecupayWebhookStatus = async (
  id: Tables<'secupay_webhook'>['id'],
  status: Tables<'secupay_webhook'>['status'],
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('secupay_webhook')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error('Database error', { cause: error.message })
}
