import { Button } from '@/components/ui/button'
import { verifySession } from '@/dal/session'
import { selectUserWithPersonalDataAndBankAccount } from '@/dal/user/queries/select-user-with-personaldata-and-bank-account'
import { Link } from '@/i18n/navigation'
import { X } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AccountEditForm from './account-edit-form'

export const metadata: Metadata = {
  title: 'App - Edit Account',
}

export default async function AccountEditPage() {
  await verifySession()

  const [user, t] = await Promise.all([
    selectUserWithPersonalDataAndBankAccount(),
    getTranslations('account'),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('editPage.title')}
          </h1>
          <p className="text-muted-foreground">{t('editPage.description')}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/app/account">
            <X className="mr-2 size-4" />
            {t('editPage.cancelButton')}
          </Link>
        </Button>
      </div>

      <AccountEditForm initialPersonalData={user.personal_data} user={user} />
    </div>
  )
}
