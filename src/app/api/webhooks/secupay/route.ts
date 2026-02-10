import {
  adminUpdateSecupayWebhookStatus,
  adminUpsertSecupayWebhookEvent,
} from '@/dal/admin/secupay-webhook'
import { generateHmac } from '@/services/secupay/generate-hmac'
import { processPaymentTransactions } from '@/services/secupay/process-payment-transactions'
import { webhookPayloadSchema } from '@/services/secupay/schema'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Secupay Push Notification Webhook Handler
 *
 * Receives payment status updates from Secupay and updates order status accordingly.
 *
 * Example payload:
 *
 * {
 *  // Object type (always "event.pushes")
 *  "object": "event.pushes",
 *  // Object ID of the push event
 *  "id": "evt_d7a9cbd91c125ae409398b4e0e3199be",
 *  // Time of the event
 *  "created": "2021-06-21T08:30:28+02:00",
 *  // Object type: payment.transactions: Payment Transaction payment.subscriptions: Subscription
 *  "target": "payment.transactions",
 *  // Event type: changed: The object has changed added: The object has been added
 *  "type": "changed",
 *  // Related data objects. There should be only one object /data/0.
 *  "data": [
 *   {
 *    // Object type; same as target (see above)
 *    "object": "payment.transactions",
 *    // Object ID
 *    "id": "PCI_2FY48DT0P2X6G636N5QK64UK2ADZAZ"
 *   }
 *  ]
 * }
 *
 * @see https://developer.secuconnect.com/integration/Push_Notifications_for_Payments.html
 * @see https://nextjs.org/docs/app/guides/backend-for-frontend#webhooks-and-callback-urls
 *
 * Strategy:
 *   1. Ingestion: validate and store all events in table secupay_webhook
 *   2. Processing: call processWebhook for each stored event
 *      - parses payload based on topic
 *      - calls topic-specific handlers
 *        - update order status based on Secupay transaction status
 *      - marks webhook as 'success' or 'failed'
 */
export const POST = async (req: NextRequest) => {
  try {
    // 1. VALID AUTHORIZATION
    if (
      req.nextUrl.searchParams.get('signature') !==
      generateHmac(
        `${req.nextUrl.searchParams.get('timestamp')}&${req.nextUrl.searchParams.get('order')}`,
      )
    )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. VALID PAYLOAD SENT BY SECUPAY
    const rawBody = await req.json()
    const payload = webhookPayloadSchema.safeParse(rawBody)
    if (payload.error) {
      console.error('❌ Invalid Secupay webhook payload:', payload.error)
      return NextResponse.json(
        { error: 'Invalid payload', details: payload.error.message },
        { status: 400 },
      )
    }

    // 3. STORE WEBHOOK EVENT
    const webhookEvent = await adminUpsertSecupayWebhookEvent({
      created: payload.data.created,
      data: payload.data.data,
      id: payload.data.id,
      object: payload.data.object,
      target: payload.data.target,
      type: payload.data.type,
    })

    // 4. PROCESS WEBHOOK EVENT
    // v1: synchronously during api endpoint execution.
    // v2: cron
    // v3: queue
    for (const dataItem of webhookEvent.data) {
      try {
        if (dataItem.object === 'payment.transactions')
          await processPaymentTransactions(dataItem.id)
        else throw new Error('Object not implemented')

        await adminUpdateSecupayWebhookStatus(webhookEvent.id, 'success')
      } catch (error) {
        console.error(`❌ Secupay webhook ${webhookEvent.id}:`, error)
        await adminUpdateSecupayWebhookStatus(webhookEvent.id, 'failed')
        // Still return 200 to the webhook sender to avoid retry storms.
      }
    }

    // Return 200 OK to acknowledge receipt
    // Secupay will retry until it receives 2xx response
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('❌ Secupay webhook:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
