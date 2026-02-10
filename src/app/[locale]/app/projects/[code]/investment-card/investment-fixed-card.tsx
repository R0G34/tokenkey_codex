'use client'

import { Badge } from '@/components/ui/badge'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { CountryFlag } from '../../country-flag'
import { useProject } from '../project-context'
import InvestmentLink from './investment-link'
import MaximizeButton from './maximize-button'

interface Props {
  annualizedReturn: number
  coverImage: Tables<'project_image'>
  progressPercentage: number
  project: Tables<'project'>
  tokensSold: number
  translations: Tables<'project_translation'>
}

export default function InvestmentFixedCard({
  annualizedReturn,
  coverImage,
  progressPercentage,
  project,
  tokensSold,
  translations,
}: Props) {
  const { setShowInvestDialog } = useProject()
  const tProject = useTranslations('project')
  const tInvestment = useTranslations('investment')

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 shadow-lg lg:hidden">
      <div className="mb-2 flex items-center gap-4">
        <div className="relative">
          <Image
            alt={`Thumbnail for ${translations.name}`}
            blurDataURL="/img/placeholder-image.svg"
            className="aspect-square rounded-md object-cover"
            height={60}
            placeholder="blur"
            src={coverImage.url}
            width={60}
          />

          <MaximizeButton />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{translations.name}</h2>
            <Badge
              variant="outline"
              className="border-primary text-xs text-primary"
            >
              {/* @ts-expect-error */}
              {tProject(`Project.status.${project.status}`)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {translations.city}, {translations.state} {translations.country}{' '}
            <CountryFlag code="es" />
          </p>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {tInvestment('minimumInvestment')}
          </p>
          <p className="text-lg font-bold">
            {currencyFormatter.format(project.token_price / 100)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {tInvestment('expectedReturn')}
          </p>
          <p className="text-lg font-bold text-green-600">
            {project.profitability / 100}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{tInvestment('term')}</p>
          <p className="text-lg font-bold">
            {tInvestment('termValue', { term: project.term })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{tInvestment('apr')}</p>
          <p className="text-lg font-bold text-green-600">
            {annualizedReturn.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="mb-2 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            {tInvestment('progress')}
          </span>
          <span className="text-sm font-medium">
            {progressPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted">
          <div
            className="h-2.5 rounded-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{tInvestment('tokensSold', { tokens: tokensSold })}</span>
          </div>
          <span>
            {tInvestment('remainingTokens', {
              tokens: numberFormatter.format(project.total_token - tokensSold),
            })}
          </span>
        </div>
      </div>
      <InvestmentLink className="mt-2" project={project} />
      <p className="mt-2 text-xs">
        {tInvestment.rich('warning', {
          strong: (chunks) => (
            <strong className="font-semibold">{chunks}</strong>
          ),
        })}
      </p>
    </div>
  )
}
