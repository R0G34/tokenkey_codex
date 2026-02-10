'use client'

import { Card, CardContent } from '@/components/ui/card'

import { Tables } from '@/lib/supabase/types/database.types'
import { useTranslations } from 'next-intl'
import { DocumentsList } from './documents-list'

interface Props {
  documents: Tables<'project_document'>[]
}

export function Documents({ documents }: Props) {
  const t = useTranslations('project')

  return (
    <Card>
      <CardContent>
        <h3 className="mb-4 font-semibold">
          {t('tabs.documents.inner_title')}
        </h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('tabs.documents.description')}
          </p>
          <DocumentsList
            documents={documents.map((document) => ({
              ...document,
              // @ts-expect-error
              type: t(`document.${document.type}`),
            }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
