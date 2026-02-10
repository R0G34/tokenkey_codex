import { selectUserWithCompanyAndPersonalDataAndBankAccount } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { PersonType } from '../account-type-form-schema'
import PersonalDataForm from './personaldata-form'

export default async function PersonalInformationPageContent() {
  const [locale, user] = await Promise.all([
    getLocale(),
    selectUserWithCompanyAndPersonalDataAndBankAccount(),
  ])

  if (user.type === null) return redirect({ href: '/app/onboarding', locale })
  if (user.type === Number(PersonType.Company) && !user.company)
    return redirect({ href: '/app/onboarding/company', locale })

  return (
    <PersonalDataForm
      initialBankAccount={
        user.bank_account.length ? user.bank_account[0] : null
      }
      initialPersonalData={user.personal_data}
      user={user}
    />
  )
}
