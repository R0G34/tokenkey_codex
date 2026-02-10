import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { listByBucket } from '@/dal/storage'
import { redirect } from '@/i18n/navigation'
import { getAreAllFilesUploaded } from '@/utils/files'
import { getLocale } from 'next-intl/server'
import AccountTypeForm from './account-type-form'
import { PersonType } from './account-type-form-schema'

export default async function OnboardingPageContent() {
  const [locale, user, files] = await Promise.all([
    getLocale(),
    selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet(),
    listByBucket('company-documents'),
  ])

  const areAllFilesUploaded = getAreAllFilesUploaded(
    files,
    !!user.personal_data?.roles?.powerOfAttorney,
  )

  if (user.type === Number(PersonType.Customer)) {
    if (!user.personal_data)
      return redirect({ href: '/app/onboarding/personal-data', locale })
    if (user.personal_data.pep === null || user.personal_data.pep === undefined)
      return redirect({ href: '/app/onboarding/pep', locale })
    if (
      !user.experience?.consent ||
      (user.experience.consent === 'no' && !user.experience.risk_consent) ||
      (user.experience.consent === 'yes' &&
        (user.experience.score === null ||
          (user.experience.score < 7 && !user.experience.risk_consent)))
    )
      return redirect({ href: '/app/onboarding/wphg', locale })
    return redirect({ href: '/app/onboarding/identification', locale })
  }

  if (user.type === Number(PersonType.Company)) {
    if (!user.company)
      return redirect({ href: '/app/onboarding/company', locale })
    if (!user.personal_data)
      return redirect({ href: '/app/onboarding/personal-data', locale })
    if (user.personal_data.pep === null || user.personal_data.pep === undefined)
      return redirect({ href: '/app/onboarding/pep', locale })
    if (!user.company.representatives)
      return redirect({
        href: '/app/onboarding/ubo-aml',
        locale,
      })
    if (!user.company.beneficial_owners)
      return redirect({
        href: '/app/onboarding/ubo-aml/beneficial-owners',
        locale,
      })
    if (!areAllFilesUploaded)
      return redirect({ href: '/app/onboarding/ubo-aml/documents', locale })
    if (
      !user.experience?.consent ||
      (user.experience.consent === 'no' && !user.experience.risk_consent) ||
      (user.experience.consent === 'yes' &&
        (user.experience.score === null ||
          (user.experience.score < 7 && !user.experience.risk_consent)))
    )
      return redirect({ href: '/app/onboarding/wphg', locale })
    return redirect({ href: '/app/onboarding/identification', locale })
  }

  return <AccountTypeForm user={user} />
}
