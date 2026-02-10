'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

export const InvestmentDialog25000FormSchema = z.object({})

export type InvestmentDialog25000FormSchemaDataType = z.infer<
  typeof InvestmentDialog25000FormSchema
>

const documents: Tables<'project_document'>[] = [
  {
    id: 1,
    created_at: new Date().toISOString(),
    filename: '/legals/securities-information-sheet.pdf',
    key: 'securities-information-sheet',
    project_id: 0,
    type: 'securities-information-sheet',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    created_at: new Date().toISOString(),
    filename: '/legals/risk-information.pdf',
    key: 'risk-information',
    project_id: 0,
    type: 'risk-information',
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    created_at: new Date().toISOString(),
    filename: '/legals/cost-information.pdf',
    key: 'cost-information',
    project_id: 0,
    type: 'cost-information',
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    created_at: new Date().toISOString(),
    filename: '/legals/revocation-instruction.pdf',
    key: 'revocation-instruction',
    project_id: 0,
    type: 'revocation-instruction',
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    created_at: new Date().toISOString(),
    filename: '/legals/egbgb-consumer-information.pdf',
    key: 'egbgb-consumer-information',
    project_id: 0,
    type: 'egbgb-consumer-information',
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    created_at: new Date().toISOString(),
    filename: '/legals/terms-of-use.pdf',
    key: 'terms-of-use',
    project_id: 0,
    type: 'terms-of-use',
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    created_at: new Date().toISOString(),
    filename: '/legals/customer-information.pdf',
    key: 'customer-information',
    project_id: 0,
    type: 'customer-information',
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    created_at: new Date().toISOString(),
    filename: '/legals/data-protection-agreement.pdf',
    key: 'data-protection-agreement',
    project_id: 0,
    type: 'data-protection-agreement',
    updated_at: new Date().toISOString(),
  },
]

export default function DocumentsList() {
  const tProject = useTranslations('project')

  return (
    <ul className="space-y-1 font-semibold text-primary">
      {documents.map((document) => (
        <li key={document.id}>
          <a
            className="flex items-center gap-1"
            href={document.filename}
            target="_blank"
          >
            <FileText />
            {/* @ts-expect-error */}
            {tProject(`document.legals.${document.type}`)}
          </a>
        </li>
      ))}
    </ul>
  )
}
