'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
  order: Tables<'order'>
}

export function RejectionCard({ order }: Props) {
  const t = useTranslations('investment')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          {t('detail.rejection.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('detail.rejection.description')}
        </p>

        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">
            ⚠️ {t('detail.rejection.note')}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted p-4">
          <h4 className="mb-2 text-sm font-medium">
            {t('detail.rejection.nextSteps')}
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• {t('detail.rejection.step1')}</li>
            <li>• {t('detail.rejection.step2')}</li>
            <li>• {t('detail.rejection.step3')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
