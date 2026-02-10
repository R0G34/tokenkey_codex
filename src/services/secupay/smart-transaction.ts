import { adminUpdateSecupaySmartTransaction } from '@/dal/admin/secupay-smart-transaction'
import {
  insertSecupaySmartTransaction,
  updateSecupaySmartTransaction,
} from '@/dal/secupay-smart-transaction'
import { api } from './api'
import {
  CreateSmartTransactionRequest,
  PrepareDebitRequest,
  prepareDebitResponseSchema,
  searchSmartTransactionResponseSchema,
  smartTransactionResponseSchema,
  startTransactionResponseSchema,
} from './schema'

/**
 * Create a new Smart Transaction
 *
 * This creates a transaction shell that can then be authorized with a payment method.
 * For SEPA direct debit, you'll call prepareDebit() after this.
 *
 * @see https://developer.secuconnect.com/integration/Create_the_Smart_Transaction.html
 */
export const createSmartTransaction = async (
  request: CreateSmartTransactionRequest,
) => {
  const data = await api({
    method: 'POST',
    path: '/Smart/Transactions',
    body: request as unknown as Record<string, unknown>,
  })
  return smartTransactionResponseSchema.parse(data)
}

/**
 * Prepare SEPA Direct Debit authorization
 *
 * This authorizes the transaction with bank account details (IBAN).
 * Can use an existing container (stored bank account) or create a new one.
 *
 * @see https://developer.secuconnect.com/integration/Pay_with_SEPA_Direct_Debit.html
 */
export const prepareDebit = async (
  transactionId: string,
  request: PrepareDebitRequest,
) => {
  const data = await api({
    method: 'POST',
    path: `/Smart/Transactions/${transactionId}/prepare/debit`,
    body: request as unknown as Record<string, unknown>,
  })
  return prepareDebitResponseSchema.parse(data)
}

/**
 * Start/Capture the transaction
 *
 * This initiates the actual payment capture after authorization.
 * For auto_capture=true transactions, this may not be needed.
 *
 * @see https://developer.secuconnect.com/integration/Make_the_Payment.html
 */
export const startTransaction = async (transactionId: string) => {
  const data = await api({
    method: 'POST',
    path: `/Smart/Transactions/${transactionId}/start`,
    body: {},
  })
  return startTransactionResponseSchema.parse(data)
}

/**
 * Get transaction details
 *
 * Useful for checking current status after webhook notification.
 */
export const getTransaction = async (transactionId: string) => {
  const data = await api({
    method: 'GET',
    path: `/Smart/Transactions/${transactionId}`,
  })
  return smartTransactionResponseSchema.parse(data)
}

export const searchTransactions = async ({
  paymentTransactionId,
  count,
}: {
  paymentTransactionId: string
  count: number
}) => {
  const data = await api({
    method: 'GET',
    path: `/Smart/Transactions?q=transactions.id:${paymentTransactionId}&count=${count}`,
  })
  return searchSmartTransactionResponseSchema.parse(data)
}

/**
 * Authorize SEPA direct debit payment (Steps 1 & 2 only)
 *
 * Creates transaction and authorizes with IBAN, but does NOT capture.
 * Used during investment flow - capture happens after compliance approval.
 *
 * @returns Transaction ID for later capture
 */
export const authorizeSepaDirectDebit = async ({
  isDemo,
  orderId,
  amount,
  currency = 'EUR',
  customer,
  iban,
  accountOwner,
  webhookUrl,
  contractId,
}: {
  isDemo: boolean
  orderId: number
  amount: number // in cents
  currency?: string
  customer: {
    forename: string
    surname: string
    email: string
  }
  iban: string
  accountOwner: string
  webhookUrl: string
  contractId: string
}) => {
  // 1. Create Smart Transaction
  const smartTransaction = await createSmartTransaction({
    is_demo: isDemo,
    intent: 'sale',
    transactionRef: 'Payment tokenkey.io',
    merchantRef: `${orderId}`,
    contract: { id: contractId },
    customer: { contact: customer },
    basket_info: { currency, sum: amount },
    payment_context: { auto_capture: false },
    application_context: { return_urls: { url_push: webhookUrl } },
  })

  // 2. Prepare debit with IBAN (authorization)
  const prepareResponse = await prepareDebit(smartTransaction.id, {
    container: {
      merchant_id: smartTransaction.merchant?.id!,
      type: 'bank_account',
      private: { owner: accountOwner, iban: iban.replace(/\s/g, '') },
    },
  })

  return { smartTransaction, prepareResponse }
}

/**
 * Capture a pre-authorized SEPA direct debit payment (Step 3 only)
 *
 * Calls startTransaction to capture a payment that was previously authorized.
 * Used after compliance approval (runs from webhook context, no user session).
 */
export const captureSepaDirectDebit = async (transactionId: string) => {
  const startResponse = await startTransaction(transactionId)

  // Use admin function since this runs from webhook context
  await adminUpdateSecupaySmartTransaction(startResponse.id, {
    status: startResponse.status,
  })

  return startResponse
}

/**
 * Helper: Create and authorize a SEPA direct debit payment in one flow
 *
 * Combines createSmartTransaction + prepareDebit + startTransaction.
 * This is the main entry point for processing a payment.
 *
 * Each step is persisted to the database with the API response appended to the responses array.
 */
export const processSepaDirectDebitPayment = async ({
  isDemo,
  orderId,
  amount,
  currency = 'EUR',
  customer,
  iban,
  accountOwner,
  webhookUrl,
  contractId,
}: {
  isDemo: boolean
  orderId: number
  amount: number // in cents
  currency?: string
  customer: {
    forename: string
    surname: string
    email: string
  }
  iban: string
  accountOwner: string
  webhookUrl: string
  contractId: string
}) => {
  // 1. Create Smart Transaction
  const smartTransaction = await createSmartTransaction({
    is_demo: isDemo,
    intent: 'sale',
    transactionRef: 'Payment tokenkey.io',
    merchantRef: `${orderId}`,
    contract: { id: contractId },
    customer: { contact: customer },
    basket_info: { currency, sum: amount },
    payment_context: { auto_capture: false },
    application_context: { return_urls: { url_push: webhookUrl } },
  })

  await insertSecupaySmartTransaction({
    id: smartTransaction.id,
    order_id: orderId,
    // Serialize to JSON to ensure type compatibility with Supabase's Json type
    responses: [JSON.parse(JSON.stringify(smartTransaction))],
    status: smartTransaction.status,
  })

  // 2. Prepare debit with IBAN
  const prepareResponse = await prepareDebit(smartTransaction.id, {
    container: {
      merchant_id: smartTransaction.merchant?.id!,
      type: 'bank_account',
      private: { owner: accountOwner, iban: iban.replace(/\s/g, '') },
    },
  })

  await updateSecupaySmartTransaction(prepareResponse.id, {
    order_id: orderId,
    // Serialize to JSON to ensure type compatibility with Supabase's Json type
    responses: [
      JSON.parse(JSON.stringify(smartTransaction)),
      JSON.parse(JSON.stringify(prepareResponse)),
    ],
    status: prepareResponse.status,
  })

  // 3. Start/capture the transaction
  const startResponse = await startTransaction(smartTransaction.id)

  await updateSecupaySmartTransaction(startResponse.id, {
    order_id: orderId,
    // Serialize to JSON to ensure type compatibility with Supabase's Json type
    responses: [
      JSON.parse(JSON.stringify(smartTransaction)),
      JSON.parse(JSON.stringify(prepareResponse)),
      JSON.parse(JSON.stringify(startResponse)),
    ],
    status: startResponse.status,
  })

  return smartTransaction
}
