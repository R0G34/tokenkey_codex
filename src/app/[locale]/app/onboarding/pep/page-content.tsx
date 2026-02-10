import { selectUserWithPersonalData } from '@/dal/user/queries/select-user-with-personaldata'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import PepForm from './pep-form'

export default async function PepPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithPersonalData(),
  ])

  if (!user.personal_data)
    return redirect({ href: '/app/onboarding/personal-data', locale })

  return <PepForm personalData={user.personal_data} user={user} />
}
