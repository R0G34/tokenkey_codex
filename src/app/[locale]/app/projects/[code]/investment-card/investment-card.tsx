'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { selectProjectWithDetailsByCode } from '@/dal/project/queries/select-project-with-details-by-code'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { CountryFlag } from '../../country-flag'
import InvestmentFixedCard from './investment-fixed-card'
import { InvestmentSummary } from './investment-summary'
import MaximizeButton from './maximize-button'

interface Props {
  images: Tables<'project_image'>[]
  optinSummary?: Tables<'project_optin_summary'>
  project: NonNullable<
    Awaited<ReturnType<typeof selectProjectWithDetailsByCode>>
  >
  translations: Tables<'project_translation'>
}

export default function InvestmentCard({
  images,
  optinSummary,
  project,
  translations,
}: Props) {
  const tProject = useTranslations('project')
  const tInvestment = useTranslations('investment')

  const tokensSold = optinSummary?.tokens ?? 0
  const progressPercentage = (tokensSold / project.total_token) * 100
  const annualizedReturn = (project.profitability / 100) * (12 / project.term)
  const coverImage = images.find(({ cover }) => cover)!

  return (
    <>
      <div className="mt-[88px] hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="group relative h-full">
                    <Image
                      alt={`Thumbnail for ${translations.name}`}
                      blurDataURL="/img/placeholder-image.svg"
                      className="aspect-square rounded-md object-cover"
                      height={80}
                      placeholder="blur"
                      src={coverImage.url}
                      width={80}
                    />
                    <MaximizeButton className="opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col items-start justify-between">
                    <Badge
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      {/* @ts-expect-error */}
                      {tProject(`Project.status.${project.status}`)}
                    </Badge>
                    <h2 className="font-semibold">{translations.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {translations.city}, {translations.state},{' '}
                      {translations.country} <CountryFlag code="es" />
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-sm text-muted-foreground">
                      {tInvestment('apr')}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {annualizedReturn.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {tInvestment('term')}
                    </p>
                    <p className="text-lg font-bold">
                      {tInvestment('termValue', { term: project.term })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
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
                      <span>
                        {tInvestment('tokensSold', { tokens: tokensSold })}
                      </span>
                    </div>
                    <span>
                      {tInvestment('remainingTokens', {
                        tokens: numberFormatter.format(
                          project.total_token - tokensSold,
                        ),
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <InvestmentSummary project={project} />
        </div>
      </div>

      <InvestmentFixedCard
        annualizedReturn={annualizedReturn}
        coverImage={coverImage}
        progressPercentage={progressPercentage}
        project={project}
        tokensSold={tokensSold}
        translations={project.translations[0]}
      />
    </>
  )
}
