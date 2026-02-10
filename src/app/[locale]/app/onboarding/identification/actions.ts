'use server'

import { insertConcedusIdentLink } from '@/dal/concedus-ident-link'
import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { updatePersonalData } from '@/dal/personaldata'
import { verifySession } from '@/dal/session'
import { listByBucket } from '@/dal/storage'
import { redirect as i18nRedirect } from '@/i18n/navigation'
import { importCustomer } from '@/services/concedus/customer'
import { getStatusByIdent } from '@/services/concedus/status'
import { renewSession } from '@/utils/authjs/renew-session'
import { getAreAllFilesUploaded } from '@/utils/files'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../account-type-form-schema'
import { buildCustomerPayload } from './utils'

export async function getStatus(kycDataId: string) {
  const [indentStatus /* , personStatus */] = await Promise.all([
    getStatusByIdent(kycDataId),
    // getStatusByPerson(`PERS_${user.id}`),
  ])
  return [indentStatus]
}

export async function startKyc() {
  const session = await verifySession()

  const [user, files] = await Promise.all([
    selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet(),
    listByBucket('company-documents'),
  ])

  if (
    !user.personal_data ||
    !user.bank_account ||
    (user.type === Number(PersonType.Company) &&
      (!user.personal_data.roles ||
        !user.company ||
        !user.company.beneficial_owners ||
        !user.company.representatives ||
        !getAreAllFilesUploaded(
          files,
          user.personal_data.roles.powerOfAttorney,
        ))) ||
    user.personal_data.pep === null ||
    !user.experience ||
    !user.wallet
  ) {
    const locale = await getLocale()
    return i18nRedirect({ href: '/app/onboarding', locale })
  }

  const customer = buildCustomerPayload(
    user.bank_account[0],
    user.company,
    user.experience,
    files,
    user.personal_data,
    user,
  )

  console.log('🔥 customer', JSON.stringify(customer))

  const response = await importCustomer(customer)

  console.log('🔥 response', JSON.stringify(response))

  if (!response.identLinks.length) {
    console.log('🔥 OK No ident required')
    const [, , locale] = await Promise.all([
      updatePersonalData({ kyc: true }),
      renewSession({ onboardingCompleted: true }),
      getLocale(),
    ])
    return i18nRedirect({ href: '/app/projects', locale })
  }

  await insertConcedusIdentLink({
    kyc: response.identLinks[0].kyc,
    action_id: response.identLinks[0].actionId,
    status: response.identLinks[0].status,
    url: response.identLinks[0].url,
    transaction_id: response.identLinks[0].transactionId,
    user_id: session.user.id,
  })

  return response.identLinks[0].url
}
