import { selectUserWithPersonalDataAndCompany } from '@/dal/user/queries/select-user-with-personaldata-and-company'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../../account-type-form-schema'
import { RepresentativesContent } from './representatives-content'
import { RepresentativesProvider } from './representatives-context'

export default async function RepresentativesPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndCompany(),
  ])

  if (!user.personal_data)
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (user.type !== Number(PersonType.Company.valueOf()))
    return redirect({ href: '/app/onboarding/personal-data', locale })
  if (user.personal_data.pep === null)
    return redirect({ href: '/app/onboarding/pep', locale })
  if (!user.company)
    return redirect({ href: '/app/onboarding/company', locale })

  return (
    <RepresentativesProvider
      initialCompany={user.company}
      initialPersonalData={user.personal_data}
    >
      <RepresentativesContent />
    </RepresentativesProvider>
  )
}
