import { selectUserWithPersonalDataAndExperience } from '@/dal/onboarding/queries/select-user-with-personaldata-and-experience'
import { listByBucket } from '@/dal/storage'
import { redirect } from '@/i18n/navigation'
import { getAreAllFilesUploaded } from '@/utils/files'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../../account-type-form-schema'
import WphgRiskWarningForm from './wphg-risk-warning-form'

export default async function WphgRiskWarningPageContent() {
  const [locale, user, files] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndExperience(),
    listByBucket('company-documents'),
  ])

  const areAllFilesUploaded = getAreAllFilesUploaded(
    files,
    !!user.personal_data?.roles?.powerOfAttorney,
  )

  if (!user.personal_data) return redirect({ href: '/app/onboarding', locale })
  if (
    user.type === Number(PersonType.Customer) &&
    (user.personal_data.pep === null || user.personal_data.pep === undefined)
  )
    return redirect({ href: '/app/onboarding/pep', locale })
  if (user.type === Number(PersonType.Company) && !areAllFilesUploaded)
    return redirect({ href: '/app/onboarding/ubo-aml', locale })

  if (!user.experience?.consent)
    return redirect({ href: '/app/onboarding/wphg', locale })
  if (
    user.experience.risk_consent ||
    user.experience.consent === 'professional' ||
    (user.experience.consent === 'yes' &&
      user.experience.score &&
      user.experience.score >= 7)
  )
    return redirect({ href: '/app/onboarding/custody', locale })

  return (
    <WphgRiskWarningForm
      initialRiskConsent={user.experience.risk_consent}
      name={`${user.personal_data.forename} ${user.personal_data.surname}`}
    />
  )
}
