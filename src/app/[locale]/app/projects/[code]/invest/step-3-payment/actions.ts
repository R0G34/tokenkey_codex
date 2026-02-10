'use server'

import {
  ORDER_COMPLIANCE_STATUS,
  ORDER_PAYMENT_STATUS,
  secupayToInternalMap,
} from '@/app/[locale]/app/investments/constants'
import { insertBankAccountAsDefault } from '@/dal/bank-account'
import { insertOrderWithSelect, updateOrder } from '@/dal/orders'
import { selectProjectTokenizedById } from '@/dal/project/queries/select-project-tokenized-by-id'
import { insertSecupaySmartTransaction } from '@/dal/secupay-smart-transaction'
import { verifySession } from '@/dal/session'
import { selectUserWithPersonalDataAndOrderCountByProjectId } from '@/dal/user/queries/select-user-with-personaldata-and-order-by-project-id'
import { routing } from '@/i18n/routing'
import { Tables } from '@/lib/supabase/types/database.types'
import { buildContractPayload } from '@/services/concedus/build-contract-payload'
import { importContract } from '@/services/concedus/contract'
import { generateContractPDF } from '@/services/concedus/generate-contract-pdf'
import { generateHmac } from '@/services/secupay/generate-hmac'
import { authorizeSepaDirectDebit } from '@/services/secupay/smart-transaction'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

/**
 * Create order
 * And in same flow also:
 *   - authorize payment
 *   - send contract for compliance check
 *
 * 1. Create order
 * 2. Authorize payment with SEPA direct debit (create + prepare)
 * 3. Generate contract PDFs
 * 4. Send to Concedus for compliance
 *
 * The payment capture will happen automatically after compliance approval.
 */
export async function createOrder({
  quantity,
  projectId,
  iban,
  accountOwner,
  isNewBankAccount,
}: {
  quantity: number
  projectId: Tables<'project'>['id']
  iban: string
  accountOwner: string
  isNewBankAccount: boolean
}) {
  const session = await verifySession()

  const [project, user] = await Promise.all([
    selectProjectTokenizedById(projectId),
    selectUserWithPersonalDataAndOrderCountByProjectId(projectId),
  ])

  const t = await getTranslations('investment.errors')

  if (!user.personal_data?.kyc) return { data: null, error: t('missing-kyc') }

  if (user.orders[0].count > 0)
    return { data: null, error: t('already-has-order') }

  // Button invest is disabled for projects without secupay_contract_id.
  if (!project.secupay_contract_id)
    return {
      data: null,
      error: 'Payment processing not configured for this project',
    }

  let order

  try {
    // Save new bank account if provided
    if (isNewBankAccount)
      await insertBankAccountAsDefault({
        iban: iban.replace(/\s/g, ''),
        holder: accountOwner,
        bank: '',
        swift: '',
        currency: 'EUR',
        location: '',
        verification_amount: 0,
      })

    // Create order first
    order = await insertOrderWithSelect({
      payment_reference: `TK${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      project_id: project.id,
      token_price: project.token_price,
      token_quantity: quantity,
      user_id: session.user.id,
    })

    // Then create authorize payment in secupay
    await secupayAuthorizePayment(
      order,
      quantity * project.token_price,
      project.secupay_contract_id,
      user.personal_data.forename,
      user.personal_data.surname,
      session.user.email!,
      iban,
      accountOwner,
    )

    // Then send contract for compliance control in Concedus.
    // If it fails we can retry later silently.
    try {
      await concedusComplianceControl(user.personal_data, order, project)
    } catch (error) {
      await updateOrder(order.id, {
        compliance_status: ORDER_COMPLIANCE_STATUS.CONCEDUS_COMPLIANCE_ERROR,
      })
    }

    revalidatePath('/app/investments')

    return { data: order.id, error: null }
  } catch (error) {
    console.error('❌ createOrder:', error)
    // We discard the order.
    if (order)
      await updateOrder(order.id, {
        payment_status: ORDER_PAYMENT_STATUS.SECUPAY_AUTHORIZATION_ERROR,
      })
    return {
      data: null,
      error:
        'An error occured and we could not create your order, please retry. If the problem persists please contact support.',
    }
  }
}

async function secupayAuthorizePayment(
  order: Tables<'order'>,
  amountInCents: number,
  secupayContractId: string,
  forename: string,
  surname: string,
  email: string,
  iban: string,
  accountOwner: string,
) {
  const timestamp = Math.floor(Date.now() / 1000) // Unix timestamp in seconds
  const signature = generateHmac(`${timestamp}&${order.id}`)

  let webhookUrl = `${process.env.WEBHOOK_URL}/secupay?timestamp=${timestamp}&order=${order.id}&signature=${signature}`

  const isDemo = process.env.VERCEL_ENV !== 'production'

  if (isDemo)
    webhookUrl = webhookUrl.concat(
      `&x-vercel-protection-bypass=${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`,
    )

  // Authorize payment (create smart transaction + prepare debit)
  const { smartTransaction, prepareResponse } = await authorizeSepaDirectDebit({
    isDemo,
    orderId: order.id,
    amount: amountInCents,
    customer: { forename, surname, email },
    iban: iban.replace(/\s/g, ''),
    accountOwner,
    webhookUrl,
    contractId: secupayContractId,
  })

  await insertSecupaySmartTransaction({
    id: smartTransaction.id,
    order_id: order.id,
    // Serialize to JSON to ensure type compatibility with Supabase's Json type
    responses: [
      JSON.parse(JSON.stringify(smartTransaction)),
      JSON.parse(JSON.stringify(prepareResponse)),
    ],
    status: prepareResponse.status,
  })

  await updateOrder(order.id, {
    payment_status: secupayToInternalMap[prepareResponse.status],
  })
}

async function concedusComplianceControl(
  personalData: Tables<'personal_data'>,
  order: Tables<'order'>,
  project: Tables<'project'> & {
    nyala_tokenized_asset_id: NonNullable<
      Tables<'project'>['nyala_tokenized_asset_id']
    >
  },
) {
  // Generate contract PDFs in all locales
  const contractPdfs = await Promise.all(
    routing.locales.map((locale) =>
      generateContractPDF(
        locale,
        personalData,
        order,
        project,
        personalData.user_id,
      ),
    ),
  )

  // Send English version to Concedus for compliance
  const englishIndex = routing.locales.indexOf('en')
  const englishPdf = contractPdfs[englishIndex]
  const contract = buildContractPayload(order, project)
  await importContract(contract, englishPdf)

  await updateOrder(order.id, {
    compliance_status:
      ORDER_COMPLIANCE_STATUS.CONCEDUS_PENDING_COMPLIANCE_REVIEW,
  })
}
