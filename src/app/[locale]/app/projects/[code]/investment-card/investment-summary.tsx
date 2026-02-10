'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { useTranslations } from 'next-intl'
import InvestmentLink from './investment-link'

interface Props {
  project: Tables<'project'>
}

export const InvestmentSummary = ({ project }: Props) => {
  const t = useTranslations('investment')
  return (
    <Card>
      <CardContent className="space-y-4">
        <InvestmentLink project={project} />
        <p className="text-xs">
          {t.rich('warning', {
            strong: (chunks) => (
              <strong className="font-semibold">{chunks}</strong>
            ),
          })}
        </p>
      </CardContent>
    </Card>
  )
}
