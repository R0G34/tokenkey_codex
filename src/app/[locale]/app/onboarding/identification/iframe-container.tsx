import { insertConcedusIdentLink } from '@/dal/concedus-ident-link'
import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { verifySession } from '@/dal/session'
import {
  redirect as i18nRedirect,
  redirect as redirectI18n,
} from '@/i18n/navigation'
import { importCustomer } from '@/services/concedus/customer'
import { getStatusByPerson, Status } from '@/services/concedus/status'
import { DocumentType } from '@/types/document-type'
import { FileObject } from '@supabase/storage-js'
import { getLocale } from 'next-intl/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'
import { PersonType } from '../account-type-form-schema'
import IFrame from './iframe'
import { buildCustomerPayload } from './utils'

interface Props {
  files: { [key in DocumentType]: FileObject }
  user: Awaited<
    ReturnType<
      typeof selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet
    >
  >
}

export default async function IFrameContainer({ files, user }: Props) {
  if (
    !user.personal_data ||
    !user.bank_account ||
    (user.type === Number(PersonType.Company.valueOf()) &&
      (!user.personal_data.roles ||
        !user.company ||
        !user.company.beneficial_owners ||
        !user.company.representatives)) ||
    user.personal_data.pep === null ||
    !user.experience ||
    !user.wallet
  ) {
    const locale = await getLocale()
    return i18nRedirect({ href: '/app/onboarding', locale })
  }

  const [session, locale] = await Promise.all([verifySession(), getLocale()])

  // show table with all idents and their status?

  const personStatus = await getStatusByPerson(`PERS_${user.id}`)

  if (personStatus === Status.VERIFIED)
    return redirectI18n({
      href: '/app/onboarding/identification/result',
      locale,
    })
  // if FAILURE/PENDING/ABORTED/UPDATE_PENDING then ?

  const customer = buildCustomerPayload(
    user.bank_account[0],
    user.company,
    user.experience,
    files,
    user.personal_data,
    user,
  )
  const response = await importCustomer(customer)

  if (!response.identLinks.length) {
    console.log('🔥 OK No ident required')
    // redirect? show msg result + button? update personal_data.kyc?
  }

  await insertConcedusIdentLink({
    kyc: response.identLinks[0].kyc,
    action_id: response.identLinks[0].actionId,
    status: response.identLinks[0].status,
    url: response.identLinks[0].url,
    transaction_id: response.identLinks[0].transactionId,
    user_id: session.user.id,
  })

  return redirect(response.identLinks[0].url)

  return <IFrame url={response.identLinks[0].url} />
}
