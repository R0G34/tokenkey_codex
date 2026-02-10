import { secupayToInternalMap } from '@/app/[locale]/app/investments/constants'
import { adminUpdateOrder } from '@/dal/admin/orders'
import { adminUpdateAndSelectSecupaySmartTransactionById } from '@/dal/admin/secupay-smart-transaction'
import { searchTransactions } from './smart-transaction'

/**
 * Process a payment transaction update
 *
 * Fetches the Smart Transaction from Secupay to get the current status,
 * then updates our database records accordingly.
 */
export async function processPaymentTransactions(paymentTransactionId: string) {
  const searchResult = await searchTransactions({
    paymentTransactionId,
    count: 1,
  })

  // https://developer.secuconnect.com/integration/Push_Notifications_for_Payments.html#PushNotificationsforPayments-FindSmartTransactionbyPaymentTransactionID
  if (searchResult.data.length !== 1)
    throw new Error(
      `No Smart Transaction found for payment: ${paymentTransactionId}`,
    )

  const smartTransaction = searchResult.data[0]

  const secupayTx = await adminUpdateAndSelectSecupaySmartTransactionById(
    smartTransaction.id,
  )

  await adminUpdateOrder(secupayTx.order_id, {
    payment_status: secupayToInternalMap[smartTransaction.status],
  })
}
