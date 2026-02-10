import { selectBankAccounts } from '@/dal/bank-account'
import { verifySession } from '@/dal/session'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BankAccountsContent } from './bank-accounts-content'

export const metadata: Metadata = {
  title: 'App - Bank Accounts',
}

export default async function BankAccountsPage() {
  await verifySession()

  const [bankAccounts, t] = await Promise.all([
    selectBankAccounts(),
    getTranslations('account.bankAccounts'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <BankAccountsContent bankAccounts={bankAccounts} />
    </div>
  )
}
