import { selectUserWithPersonalDataAndCompany } from '@/dal/user/queries/select-user-with-personaldata-and-company'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../../account-type-form-schema'
import { BeneficialOwnersContent } from './beneficial-owners-content'
import { BeneficialOwnersProvider } from './beneficial-owners-context'

export default async function BeneficialOwnersPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndCompany(),
  ])

  if (!user.personal_data)
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (user.type !== Number(PersonType.Company.valueOf()))
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (!user.company)
    return redirect({ href: '/app/onboarding/company', locale })
  if (!user.company.representatives)
    return redirect({ href: '/app/onboarding/ubo-aml', locale })

  return (
    <BeneficialOwnersProvider
      initialCompany={user.company}
      initialPersonalData={user.personal_data}
    >
      <BeneficialOwnersContent />
    </BeneficialOwnersProvider>
  )
}
