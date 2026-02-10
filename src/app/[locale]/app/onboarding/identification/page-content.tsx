import { selectUserWithPersonalDataAndBankAccountAndCompanyAndExperienceAndWalletAndConcedusIdentLink } from '@/dal/onboarding/queries/select-user-with-personaldata-and-bank-account-and-company-and-experience-and-wallet-and-concedus-ident-link'
import { updatePersonalData } from '@/dal/personaldata'
import { redirect } from '@/i18n/navigation'
import { Status } from '@/services/concedus/status'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../account-type-form-schema'
import { getStatus } from './actions'
import Aborted from './components/aborted'
import Failure from './components/failure'
import Initial from './components/initial'
import Pending from './components/pending'
import Verified from './components/verified'

export default async function IdentificationPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndBankAccountAndCompanyAndExperienceAndWalletAndConcedusIdentLink(),
  ])

  if (
    !user.personal_data ||
    !user.bank_account ||
    (user.type === Number(PersonType.Company.valueOf()) &&
      (!user.personal_data.roles ||
        !user.company ||
        !user.company.beneficial_owners ||
        !user.company.representatives)) ||
    user.personal_data.pep === null ||
    user.personal_data.pep === undefined ||
    !user.experience?.consent ||
    (user.experience.consent === 'no' && !user.experience.risk_consent) ||
    (user.experience.consent === 'yes' &&
      (user.experience.score === null ||
        (user.experience.score < 7 && !user.experience.risk_consent))) ||
    !user.wallet
  )
    return redirect({ href: '/app/onboarding', locale })

  if (!user.concedus_ident_link.length) return <Initial />

  // TODO: handle retries? Select only most recent identLink? (2025-12-07)
  const [identStatus] = await getStatus(user.concedus_ident_link[0].action_id)

  switch (identStatus) {
    case Status.VERIFIED: {
      await updatePersonalData({ kyc: true })
      return <Verified />
    }
    case Status.PENDING:
    case Status.UPDATE_PENDING:
      return <Pending concedusIdentLink={user.concedus_ident_link[0]} />
    case Status.FAILURE:
      return <Failure />
    case Status.ABORTED:
      return <Aborted />
    default:
      return <div>Unknown status</div>
  }
}
