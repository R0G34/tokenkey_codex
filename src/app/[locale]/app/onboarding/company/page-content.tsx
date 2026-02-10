import { selectUserWithCompanyAndBankAccount } from '@/dal/onboarding/queries/select-user-with-company-and-bank-account'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../account-type-form-schema'
import CompanyForm from './company-form'

export default async function CompanyPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithCompanyAndBankAccount(),
  ])

  if (user.type === null) return redirect({ href: '/app/onboarding', locale })
  if (user.type !== Number(PersonType.Company))
    return redirect({ href: '/app/onboarding/personal-data', locale })

  return (
    <CompanyForm
      initialBankAccount={
        user.bank_account.length ? user.bank_account[0] : null
      }
      initialCompany={user.company}
    />
  )
}
