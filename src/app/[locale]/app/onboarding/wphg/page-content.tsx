import { selectUserWithPersonalDataAndExperience } from '@/dal/onboarding/queries/select-user-with-personaldata-and-experience'
import { listByBucket } from '@/dal/storage'
import { redirect } from '@/i18n/navigation'
import { getAreAllFilesUploaded } from '@/utils/files'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../account-type-form-schema'
import WphgInitialForm from './wphg-initial-form'

export default async function WphgPageContent() {
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
    user.type === Number(PersonType.Customer.valueOf()) &&
    (user.personal_data.pep === null || user.personal_data.pep === undefined)
  )
    return redirect({ href: '/app/onboarding/pep', locale })
  if (
    user.type === Number(PersonType.Company.valueOf()) &&
    !areAllFilesUploaded
  )
    return redirect({ href: '/app/onboarding/ubo-aml/documents', locale })

  return (
    <WphgInitialForm
      initialConsent={user.experience ? user.experience.consent : null}
    />
  )
}
