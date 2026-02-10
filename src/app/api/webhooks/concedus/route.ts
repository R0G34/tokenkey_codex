import {
  adminInsertConcedusWebhookEvents,
  adminUpdateConcedusWebhookStatus,
} from '@/dal/admin/concedus-webhook'
import { Json } from '@/lib/supabase/types/database.types'
import { processComplianceRecords } from '@/services/concedus/process-compliance-records'
import { processIdentResultRecord } from '@/services/concedus/process-ident-result-record'
import { processMismatchRecords } from '@/services/concedus/process-mismatch-records'
import { webhookPayloadSchema } from '@/services/concedus/schema'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook endpoint for receiving events from Concedus
 *
 * Example payload:
 *
 * [
 *   {
 *     "topic": "complianceRecord",
 *     "complianceRecord": [
 *       {
 *         "status": 100,
 *         "key": "ac0a1122ad4c440db62fe3eb602d8941",
 *         "modified": "2025-09-03T06:36:49",
 *         "customerKey": "92561303-8e1d-4b71-9537-d7c8d6163ccc"
 *       }
 *     ]
 *   },
 *   {
 *     "topic": "identResult",
 *     "kyc": "WEBID",
 *     "identId": "315065706",
 *     "personKey": "0ac7e1d8-9e39-486b-b28d-bd8551ec90ed",
 *     "reason": null,
 *     "status": "success"
 *   },
 *   {
 *     "topic: 'mismatches',
 *     "mismatches: [
 *       {
 *         IdentId: '166956507',
 *         PersonKey: 'PERS_c8f24e33-bdef-xxx2-ab7f-VER0007',
 *         Created: '2023-06-01T13:23:17.706Z',
 *         Mismatches: [
 *           {
 *             FieldName: 'BirthPlace',
 *             Value: 'Frankfurt',
 *             KycValue: 'Beirut',
 *           },
 *           {
 *             FieldName: 'Nationality',
 *             Value: 'DE',
 *             KycValue: 'lb',
 *           },
 *         ],
 *       },
 *     ],
 *   },
 *   {
 *     "topic: 'identRequestCreated',
 *     ...
 *   },
 *   {
 *     "topic: 'identResultKYC',
 *     ...
 *   }
 * ]
 *
 * Strategy:
 *   1. Ingestion: validate and store all events in table concedus_webhook
 *   2. Processing: call processWebhook for each stored event
 *      - parses payload based on topic
 *      - calls topic-specific handlers
 *      - marks webhook as 'success' or 'failed'
 */
export const POST = async (req: NextRequest) => {
  try {
    // 1. VALID AUTHORIZATION
    if (
      req.headers.get('x-concedus-signature') !==
      process.env.CONCEDUS_WEBHOOK_SECRET
    )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. VALID PAYLOAD SENT BY CONCEDUS
    const rawBody = await req.json()
    const payload = webhookPayloadSchema.safeParse(rawBody)
    if (payload.error)
      return NextResponse.json(
        {
          error: 'Unexpected payload',
          message: payload.error.message,
          cause: payload.error.cause,
        },
        { status: 400 },
      )

    // 3. STORE WEBHOOK EVENTS
    const webhookEvents = await adminInsertConcedusWebhookEvents(
      payload.data.map((event) => ({
        topic: event.topic,
        event: event as Json,
      })),
    )

    // 4. PROCESS WEBHOOK EVENTS
    // v1: synchronously during api endpoint execution.
    // v2: cron
    // v3: queue
    for (const webhookEvent of webhookEvents)
      try {
        if (webhookEvent.event.topic === 'identResult')
          await processIdentResultRecord(webhookEvent.event)
        else if (webhookEvent.event.topic === 'mismatches')
          await processMismatchRecords(webhookEvent.event.mismatches)
        else if (webhookEvent.event.topic === 'complianceRecord')
          await processComplianceRecords(webhookEvent.event.complianceRecord)
        else throw new Error('Topic not implemented')

        await adminUpdateConcedusWebhookStatus(webhookEvent.id, 'success')
      } catch (error) {
        console.error(`❌ Concedus webhook ${webhookEvent.id}:`, error)
        await adminUpdateConcedusWebhookStatus(webhookEvent.id, 'failed')
        // Still return 200 to the webhook sender to avoid retry storms.
      }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('❌ Concedus webhook:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
