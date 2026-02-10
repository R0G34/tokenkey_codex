import * as z from 'zod'

/*
[
  {
    "topic": "identRequestsCreated",
    "identLinks": [
      {
        "kyc": "WEBID",
        "url": "https://test.webid-solutions.de/service/qa/cn/.../aid/...",
        "key": "...-6e35-4726-8fef-470228bf8762",
        "actionId": "...",
        "status": "pending",
        "transactionId": "9c918ac985794573aa6336feee..."
      }
    ]
  }
]
*/
const identRequestsCreatedSchema = z.object({
  topic: z.literal('identRequestsCreated'),
  identLinks: z.array(
    z.object({
      kyc: z.string(), // 'WEBID'
      url: z.string(),
      key: z.string(),
      actionId: z.string(),
      status: z.string(),
      transactionId: z.string(),
    }),
  ),
})

const identResultEventSchema = z.object({
  topic: z.literal('identResult'),
  kyc: z.string(),
  identId: z.string(),
  personKey: z.string(),
  reason: z.string().nullable(),
  status: z.string(),
})

// export type IdentResultEvent = z.infer<typeof identResultEventSchema>

const mismatchesEventSchema = z.object({
  topic: z.literal('mismatches'),
  mismatches: z.array(
    z.object({
      IdentId: z.string(),
      PersonKey: z.string(),
      Created: z.string(),
      Mismatches: z.array(
        z.object({
          FieldName: z.string(),
          Value: z.string(),
          KycValue: z.string(),
        }),
      ),
    }),
  ),
})

export type MismatchRecord = z.infer<
  typeof mismatchesEventSchema
>['mismatches'][number]

const concedusComplianceStatusSchema = z.union([
  // 100: Release (approved)
  // 200, 400-403: Waiting for documents/additional info
  // 300-303: Rejected for various reasons
  z.literal(100),
  z.literal(200),
  z.literal(300),
  z.literal(301),
  z.literal(302),
  z.literal(303),
  z.literal(400),
  z.literal(401),
  z.literal(402),
  z.literal(403),
  z.literal(500),
  z.literal(501),
  z.literal(502),
  z.literal(503),
  z.literal(600),
  z.literal(601),
  z.literal(602),
  z.literal(700),
  z.literal(701),
  z.literal(702),
  z.literal(800),
  z.literal(801),
  z.literal(802),
])

export type ConcedusComplianceStatus = z.infer<
  typeof concedusComplianceStatusSchema
>

const complianceEventSchema = z.object({
  topic: z.literal('complianceRecord'),
  complianceRecord: z.array(
    z.object({
      key: z.string(),
      modified: z.string(),
      status: concedusComplianceStatusSchema,
      notes: z.string().optional(),
      customerKey: z.string().optional(),
      contractKey: z.string().optional(),
    }),
  ),
})

export type ConcedusComplianceRecord = z.infer<
  typeof complianceEventSchema
>['complianceRecord'][number]

export const webhookEventSchema = z.discriminatedUnion('topic', [
  identRequestsCreatedSchema,
  identResultEventSchema,
  mismatchesEventSchema,
  complianceEventSchema,
])

export const webhookPayloadSchema = z.array(webhookEventSchema)

export type WebhookEvent = z.infer<typeof webhookEventSchema>
