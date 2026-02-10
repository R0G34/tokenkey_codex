'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
  order: Tables<'order'>
}

export function ComplianceReviewCard({ order }: Props) {
  const t = useTranslations('investment')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          {t('detail.complianceReview.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('detail.complianceReview.description')}
        </p>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            ℹ️ {t('detail.complianceReview.note')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
