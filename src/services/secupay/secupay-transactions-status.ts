import { SecupayTransactionStatus } from './schema'

// https://developer.secuconnect.com/integration/Status_Flow_of_a_Smart_Transaction.html
export const SECUPAY_TRANSACTION_STATUS: Record<
  string,
  SecupayTransactionStatus
> = {
  CREATED: 'created',
  PROCESSING: 'processing',
  FAILED: 'failed',
  APPROVED: 'approved',
  PENDING: 'pending',
  RECEIVED: 'received',
  COLLECTION: 'collection',
  OK: 'ok',
  SHIPPED: 'shipped',
  COLLECTED: 'collected',
}
