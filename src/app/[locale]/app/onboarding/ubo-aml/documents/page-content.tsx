import { listByBucket } from '@/dal/storage'
import { selectUserWithPersonalDataAndCompany } from '@/dal/user/queries/select-user-with-personaldata-and-company'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../../account-type-form-schema'
import { Files } from './files'

export default async function UboAmlPageContent() {
  const [locale, user, initialFiles] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndCompany(),
    listByBucket('company-documents'),
  ])

  if (!user.personal_data)
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (user.type !== Number(PersonType.Company.valueOf()))
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (!user.company?.beneficial_owners)
    return redirect({
      href: '/app/onboarding/ubo-aml/beneficial-owners',
      locale,
    })

  return (
    <Files
      files={initialFiles}
      hasPowerOfAttorney={!!user.personal_data.roles?.powerOfAttorney}
    />
  )
}
