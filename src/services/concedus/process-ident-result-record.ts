import { updateConcedusIdentLink } from '@/dal/admin/concedus-ident-link'
import { WebhookEvent } from '@/services/concedus/schema'

export async function processIdentResultRecord(
  event: WebhookEvent & { topic: 'identResult' },
) {
  if (!event.personKey.startsWith('PERS_'))
    throw new Error(`Invalid personKey format: ${event.personKey}`)

  const userId = event.personKey.replace('PERS_', '')

  if (!userId) throw new Error(`Invalid personKey format: ${event.personKey}`)

  await updateConcedusIdentLink(event.kyc, event.identId, {
    status: event.status,
  })
}
