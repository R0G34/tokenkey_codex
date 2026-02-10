import { z } from 'zod'

/**
 * Zod schemas for Secupay API validation
 *
 * Based on https://developer.secuconnect.com/integration/Build_Your_Custom_Checkout.html
 */

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string().optional(),
})

const secupayTransactionStatusSchema = z.enum([
  'created',
  'processing',
  'failed',
  'approved',
  'pending',
  'received', // intent 'order' and 'shipping'
  'collection', // intent 'order' and 'collection'
  'ok', // intent 'sale'
  'shipped',
  'collected',
  //
  // 'authorized',
  // 'cancelled',
])

export type SecupayTransactionStatus = z.infer<
  typeof secupayTransactionStatusSchema
>

const createSmartTransactionRequestSchema = z.object({
  is_demo: z.boolean().optional(),
  intent: z.enum(['sale', 'authorization']),
  transactionRef: z.string().optional(),
  merchantRef: z.string().optional(),
  contract: z.object({ id: z.string() }),
  // amount in cents, currency e.g. "EUR"
  basket_info: z.object({ sum: z.number(), currency: z.string() }),
  customer: z
    .object({
      contact: z.object({
        forename: z.string(),
        surname: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
      }),
    })
    .optional(),
  application_context: z
    .object({
      return_urls: z.object({
        url_push: z.string().url(),
        url_success: z.string().url().optional(),
        url_failure: z.string().url().optional(),
        url_abort: z.string().url().optional(),
      }),
    })
    .optional(),
  payment_context: z.object({ auto_capture: z.boolean() }).optional(),
})
export type CreateSmartTransactionRequest = z.infer<
  typeof createSmartTransactionRequestSchema
>

const prepareDebitRequestSchema = z.object({
  container: z.union([
    // Use existing container
    z.object({ id: z.string() }),
    // New bank account container
    z.object({
      merchant_id: z.string(),
      type: z.literal('bank_account'),
      private: z.object({ owner: z.string(), iban: z.string() }),
    }),
  ]),
})
export type PrepareDebitRequest = z.infer<typeof prepareDebitRequestSchema>

export const smartTransactionResponseSchema = z.object({
  object: z.string(),
  id: z.string(),
  status: secupayTransactionStatusSchema,
  merchant: z
    .object({
      object: z.string(),
      id: z.string(),
    })
    .optional(),
  contract: z
    .object({
      id: z.string(),
    })
    .optional(),
  provider_contract: z
    .object({
      id: z.string(),
    })
    .optional(),
  customer: z
    .object({
      contact: z.object({
        forename: z.string(),
        surname: z.string(),
        email: z.string(),
      }),
    })
    .optional(),
  basket_info: z
    .object({
      sum: z.number(),
      currency: z.string(),
    })
    .optional(),
  transactions: z
    .array(
      z.object({
        object: z.string(),
        id: z.string(),
      }),
    )
    .optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
})

export const prepareDebitResponseSchema = z.object({
  object: z.string(),
  id: z.string(),
  status: secupayTransactionStatusSchema,
  container: z
    .object({
      id: z.string(),
      type: z.string(),
      object: z.string().optional(),
    })
    .optional(),
})

export const startTransactionResponseSchema = z.object({
  object: z.string(),
  id: z.string(),
  status: secupayTransactionStatusSchema,
  transactions: z
    .array(
      z.object({
        object: z.string(),
        id: z.string(),
      }),
    )
    .optional(),
})

export const searchSmartTransactionResponseSchema = z.object({
  count: z.number(),
  data: z.array(smartTransactionResponseSchema),
})
// export type SearchSmartTransactionResponse = z.infer<
//   typeof searchSmartTransactionResponseSchema
// >

// https://developer.secuconnect.com/integration/Push_Notifications_for_Payments.html
export const webhookPayloadSchema = z.object({
  // Time of the event
  created: z.string(),
  // Object type: payment.transactions: Payment Transaction payment.subscriptions: Subscription
  target: z.string(),
  // Related data objects. There should be only one object /data/0.
  data: z.array(
    z.object({
      // Object type; same as target (see above)
      object: z.string(),
      // Object ID
      id: z.string(),
    }),
  ),
  // Object ID of the push event
  id: z.string(),
  // Object type (always "event.pushes")
  object: z.literal('event.pushes'),
  // Event type: changed: The object has changed added: The object has been added
  type: z.string(),
})
// export type WebhookPayload = z.infer<typeof webhookPayloadSchema>

// https://developer.secuconnect.com/integration/API_Errors.html
export const secupayApiErrorSchema = z.object({
  // The ID of the error type (see Error Codes)
  code: z.number(),
  // Request status (always "error")
  status: z.string(),
  // Exception name
  error: z.string(),
  // Error details
  error_details: z.string().optional(),
  // Error details in German
  error_user: z.string().optional(),
  // ID by which our help desk may find more information
  supportId: z.string().optional(),
})
export type SecupayApiError = z.infer<typeof secupayApiErrorSchema>
