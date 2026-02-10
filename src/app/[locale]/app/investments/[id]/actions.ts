'use server'

import { insertBankAccountAsDefault } from '@/dal/bank-account'
import { selectOrderById, updateOrder } from '@/dal/orders'
import { selectSecupayTransactionByOrderId } from '@/dal/secupay-smart-transaction'
import { verifySession } from '@/dal/session'
import { createSignedUrl } from '@/dal/storage'
import { selectUserWithPersonalDataAndBankAccount } from '@/dal/user/queries/select-user-with-personaldata-and-bank-account'
import { selectUserWithPersonalDataAndOrderByOrderId } from '@/dal/user/queries/select-user-with-personaldata-and-order-by-order-id'
import { routing } from '@/i18n/routing'
import { Tables } from '@/lib/supabase/types/database.types'
import { buildContractPayload } from '@/services/concedus/build-contract-payload'
import { importContract } from '@/services/concedus/contract'
import { generateContractPDF } from '@/services/concedus/generate-contract-pdf'
import { generateHmac } from '@/services/secupay/generate-hmac'
import {
  captureSepaDirectDebit,
  processSepaDirectDebitPayment,
} from '@/services/secupay/smart-transaction'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { revalidatePath } from 'next/cache'
import { ORDER_COMPLIANCE_STATUS } from '../constants'

export async function signContract(orderId: Tables<'order'>['id']) {
  try {
    const session = await verifySession()

    const user = await selectUserWithPersonalDataAndOrderByOrderId(orderId)

    if (!user.order) throw new Error('Order not found')
    if (!user.personal_data) throw new Error('Personal data not found')

    const contractPdfs = await Promise.all(
      routing.locales.map((locale) =>
        generateContractPDF(
          locale,
          user.personal_data!,
          user.order!,
          user.order!.project,
          session.user.id,
        ),
      ),
    )

    // Always send English version to Concedus
    const englishIndex = routing.locales.indexOf('en')
    const englishPdf = contractPdfs[englishIndex]
    const contract = buildContractPayload(user.order, user.order.project)

    await importContract(contract, englishPdf)

    await updateOrder(orderId, {
      compliance_status:
        ORDER_COMPLIANCE_STATUS.CONCEDUS_PENDING_COMPLIANCE_REVIEW,
    })

    revalidatePath(`/app/investments/${orderId}`)

    return { data: true, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

export async function getContractUrl(
  orderId: Tables<'order'>['id'],
  locale: string,
) {
  try {
    const session = await verifySession()

    // Compute the deterministic storage path
    const storagePath = `${session.user.id}/orders/${orderId}/contract-${locale}.pdf`

    // Generate a signed URL (valid for 1 hour)
    const signedUrl = await createSignedUrl('user', storagePath)

    return { data: signedUrl, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

/**
 * Initiate SEPA direct debit payment for an order
 *
 * This creates a Secupay Smart Transaction, authorizes it with the provided IBAN,
 * and starts the payment capture. The final status will be confirmed via webhook.
 */
export async function initiatePayment({
  orderId,
  iban,
  accountOwner,
  isNewBankAccount = false,
}: {
  orderId: number
  iban: string
  accountOwner: string
  isNewBankAccount?: boolean
}) {
  try {
    await verifySession()

    // 1. Verify order exists and belongs to user
    const order = await selectOrderById(orderId)

    if (!order) return { data: null, error: 'Order not found' }

    if (!order.project.secupay_contract_id)
      return { data: null, error: 'secupay contract id not configured' }

    // 2. Verify order status is pending_payment
    if (order.payment_status)
      return {
        data: null,
        error: `Cannot process payment for order with status: ${order.payment_status}`,
      }

    // 3. Get user data for Secupay customer
    const user = await selectUserWithPersonalDataAndBankAccount()
    if (!user.personal_data)
      return { data: null, error: 'User profile incomplete' }

    // 4. If new bank account, save it as default
    if (isNewBankAccount) {
      await insertBankAccountAsDefault({
        iban,
        holder: accountOwner,
        bank: '',
        swift: '',
        currency: 'EUR',
        location: '',
        verification_amount: 0,
      })
    }

    // 5. Calculate amount in cents
    const amountInCents = order.token_quantity * order.token_price

    // 6. Process payment through Secupay

    let webhookUrl = `${process.env.WEBHOOK_URL}/secupay?`

    const isDemo = process.env.VERCEL_ENV !== 'production'

    if (isDemo)
      webhookUrl = webhookUrl.concat(
        `x-vercel-protection-bypass=${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}&`,
      )

    const timestamp = Math.floor(Date.now() / 1000) // Unix timestamp in seconds
    const signature = generateHmac(`${timestamp}&${orderId}`)

    webhookUrl = webhookUrl.concat(
      `timestamp=${timestamp}&order=${order.id}&signature=${signature}`,
    )

    const smartTransaction = await processSepaDirectDebitPayment({
      isDemo,
      orderId: order.id,
      amount: amountInCents,
      currency: 'EUR',
      customer: {
        forename: user.personal_data.forename,
        surname: user.personal_data.surname,
        email: user.email,
      },
      iban,
      accountOwner,
      webhookUrl,
      contractId: order.project.secupay_contract_id,
    })

    // 7. Update order status to payment_processing
    // await updateOrder(order.id, { payment_status: 'payment_processing' })

    revalidatePath(`/app/investments/${orderId}`)

    return { data: { transactionId: smartTransaction.id }, error: null }
  } catch (error) {
    console.error('❌ initiatePayment error:', error)
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

/**
 * Retry a failed payment
 *
 * Re-initiates the payment process for an order that previously failed.
 */
export async function retryPayment({
  orderId,
  iban,
  accountOwner,
  isNewBankAccount = false,
}: {
  orderId: number
  iban: string
  accountOwner: string
  isNewBankAccount?: boolean
}) {
  try {
    await verifySession()

    // Verify order exists and belongs to user
    const order = await selectOrderById(orderId)

    if (!order) return { data: null, error: 'Order not found' }

    // Verify order status allows retry
    if (order.payment_status !== 'payment_failed')
      return {
        data: null,
        error: `Cannot retry payment for order with status: ${order.payment_status}`,
      }

    // Reset status to pending_payment and re-initiate
    await updateOrder(order.id, { payment_status: 'pending_payment' })

    return initiatePayment({ orderId, iban, accountOwner, isNewBankAccount })
  } catch (error) {
    console.error('❌ retryPayment error:', error)
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

/**
 * Retry capturing a pre-authorized payment
 *
 * Used when auto-capture failed after compliance approval.
 * The payment was already authorized during investment, so we just need to capture.
 */
export async function retryCapturePayment({ orderId }: { orderId: number }) {
  try {
    await verifySession()

    // Verify order exists and belongs to user
    const order = await selectOrderById(orderId)

    if (!order) return { data: null, error: 'Order not found' }

    // Verify order status allows capture retry
    if (order.payment_status !== 'payment_capture_failed')
      return {
        data: null,
        error: `Cannot retry capture for order with status: ${order.payment_status}`,
      }

    // Get the pre-authorized transaction
    const transaction = await selectSecupayTransactionByOrderId(orderId)

    if (!transaction) {
      return { data: null, error: 'No pre-authorized transaction found' }
    }

    // Attempt to capture the pre-authorized payment
    await captureSepaDirectDebit(transaction.id)

    // Update order status to payment_processing
    await updateOrder(order.id, { payment_status: 'payment_processing' })

    revalidatePath(`/app/investments/${orderId}`)

    return { data: { transactionId: transaction.id }, error: null }
  } catch (error) {
    console.error('❌ retryCapturePayment error:', error)
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}
