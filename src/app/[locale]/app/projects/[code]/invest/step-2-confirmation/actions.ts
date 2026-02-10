'use server'

import { ORDER_COMPLIANCE_STATUS } from '@/app/[locale]/app/investments/constants'
import { insertMessage } from '@/dal/message'
import { insertOrderWithSelect, updateOrder } from '@/dal/orders'
import { selectProjectTokenizedById } from '@/dal/project/queries/select-project-tokenized-by-id'
import { verifySession } from '@/dal/session'
import { selectUserWithPersonalDataAndOrderCountByProjectId } from '@/dal/user/queries/select-user-with-personaldata-and-order-by-project-id'
import { routing } from '@/i18n/routing'
import { Tables } from '@/lib/supabase/types/database.types'
import { buildContractPayload } from '@/services/concedus/build-contract-payload'
import { importContract } from '@/services/concedus/contract'
import { generateContractPDF } from '@/services/concedus/generate-contract-pdf'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

// export async function invest({
//   amount,
//   projectId,
// }: {
//   amount: Tables<'optin'>['amount']
//   projectId: Tables<'project'>['id']
// }) {
//   try {
//     await verifySession()

//     const [project, user] = await Promise.all([
//       selectProjectTokenizedById(projectId),
//       selectUserWithPersonalDataAndWalletAndOptinByProjectId(projectId),
//     ])

//     const t = await getTranslations('investment.errors')

//     if (!user.personal_data || !user.wallet)
//       return { data: null, error: t('missing-kyc') }

//     if (user.optin.length) return { data: null, error: t('already-invested') }

//     const customerId =
//       user.personal_data.nyala_customer_id ??
//       (await syncCustomer(user.email, user.personal_data))

//     const externalRetailWalletId =
//       user.wallet.nyala_external_retail_wallet_id ??
//       (await syncExternalRetailWallet(customerId, user.wallet))

//     const optinId = await syncOptin(
//       amount,
//       customerId,
//       externalRetailWalletId,
//       project.nyala_tokenized_asset_id,
//       user.id,
//       user.optin[0] ?? null,
//       project,
//     )

//     revalidatePath('/app/projects/[code]')

//     return { data: optinId, error: null }
//   } catch (error) {
//     console.log('❌ invest', error)
//     const errorMessage = getErrorMessage(error)
//     return { data: null, error: errorMessage }
//   }
// }

export async function createOrder({
  quantity,
  projectId,
}: {
  quantity: Tables<'optin'>['amount']
  projectId: Tables<'project'>['id']
}) {
  try {
    const session = await verifySession()

    const [project, user] = await Promise.all([
      selectProjectTokenizedById(projectId),
      selectUserWithPersonalDataAndOrderCountByProjectId(projectId),
    ])
    const t = await getTranslations('investment.errors')

    if (!user.personal_data?.kyc) return { data: null, error: t('missing-kyc') }

    if (user.orders[0].count > 0)
      return { data: null, error: t('already-has-order') }

    const order = await insertOrderWithSelect({
      payment_reference: `TK${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      project_id: project.id,
      token_price: project.token_price,
      token_quantity: quantity,
      user_id: session.user.id,
    })

    const contractPdfs = await Promise.all(
      routing.locales.map((locale) =>
        generateContractPDF(
          locale,
          user.personal_data!,
          order,
          project,
          session.user.id,
        ),
      ),
    )

    // Always send English version to Concedus
    const englishIndex = routing.locales.indexOf('en')
    const englishPdf = contractPdfs[englishIndex]
    const contract = buildContractPayload(order, project)
    await importContract(contract, englishPdf)
    await updateOrder(order.id, {
      compliance_status:
        ORDER_COMPLIANCE_STATUS.CONCEDUS_PENDING_COMPLIANCE_REVIEW,
    })

    revalidatePath('/app/investments')

    return { data: order.id, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return { data: null, error: errorMessage }
  }
}

// export async function getDocumentUrl(document: Tables<'project_document'>) {
//   await verifySession()

//   const signedUrl = await createSignedUrl(
//     'project',
//     `${document.project_id}/doc/${document.filename}`,
//   )
//   console.log('🔥 getDocumentUrl signedUrl', signedUrl)

//   // Get public URL
//   // const publicUrl = await getPublicUrl('project', `${document.project_id}/doc/${document.filename}`)
//   // console.log('🔥 getDocumentUrl publicUrl', publicUrl)

//   return signedUrl || ''
// }

export async function sendLegals() {
  const session = await verifySession()
  const t = await getTranslations('inbox')

  await insertMessage({
    content: t('legals.content'),
    preview: t('legals.preview'),
    title: t('legals.title'),
    type: 'legals',
    attachments: [
      {
        name: t('documents.securities-information-sheet'),
        url: '/legals/securities-information-sheet.pdf',
      },
      {
        name: t('documents.risk-information'),
        url: '/legals/risk-information.pdf',
      },
      {
        name: t('documents.cost-information'),
        url: '/legals/cost-information.pdf',
      },
      {
        name: t('documents.revocation-instruction'),
        url: '/legals/revocation-instruction.pdf',
      },
      {
        name: t('documents.egbgb-consumer-information'),
        url: '/legals/egbgb-consumer-information.pdf',
      },
      {
        name: t('documents.terms-of-use'),
        url: '/legals/terms-of-use.pdf',
      },
      {
        name: t('documents.customer-information'),
        url: '/legals/customer-information.pdf',
      },
      {
        name: t('documents.data-protection-agreement'),
        url: '/legals/data-protection-agreement.pdf',
      },
    ],
    user_id: session.user.id,
  })
  revalidatePath('/app')
}
