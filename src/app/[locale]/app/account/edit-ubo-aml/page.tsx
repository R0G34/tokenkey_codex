import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { verifySession } from '@/dal/session'
import { Link } from '@/i18n/navigation'
import { ArrowRight, X } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'App - Edit UBO & AML',
}

export default async function EditUboAmlPage() {
  await verifySession()

  const t = await getTranslations('account')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('uboAml.title')}
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

      <Card>
        <CardHeader>
          <CardTitle>{t('uboAml.title')}</CardTitle>
          <CardDescription>
            To update your UBO & AML compliance documentation, please contact
            support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/app/help">
              Contact Support
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
