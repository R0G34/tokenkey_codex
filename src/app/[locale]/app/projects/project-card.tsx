import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { cn } from '@/utils/tailwind/cn'
import { CalendarClock, Coins, MapPin, TrendingUp, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { CountryFlag } from './country-flag'

interface Props extends PropsWithChildren {
  images: Tables<'project_image'>[]
  optinSummary?: Tables<'project_optin_summary'>
  project: Tables<'project'>
  translations: Tables<'project_translation'>
}

export function ProjectCard({
  children,
  images,
  optinSummary,
  project,
  translations,
}: Props) {
  const t = useTranslations('project.Project')

  // const indicators1 = [
  //   {
  //     icon: Euro,
  //     title: 'Precio total',
  //     value: currencyFormatter.format(
  //       project.total_amount,
  //     ),
  //   },
  //   {
  //     icon: Coins,
  //     title: 'Precio token',
  //     value: currencyFormatter.format(project.token_price),
  //   },
  // ]

  // const indicators2 = [
  //   {
  //     icon: Coins,
  //     title: 'Tokens',
  //     value: numberFormatter.format(project.total_token),
  //   },
  //   {
  //     icon: Calendar,
  //     title: 'Plazo',
  //     value: `${numberFormatter.format(project.term)} ${project.term > 1 ? 'meses' : 'mes'}`,
  //   },
  // ]

  const investors = optinSummary?.users ?? 0
  const tokensSold = optinSummary?.tokens ?? 0

  const progress = (tokensSold / project.total_token) * 100
  const remainingTokens = project.total_token - tokensSold

  return (
    <Card
      className={cn(
        'w-[350px] gap-0 overflow-hidden bg-white py-0 transition-shadow duration-300 hover:shadow-lg',
        project.nyala_tokenized_asset_id ? '' : 'pointer-events-none',
      )}
    >
      <div className="relative">
        <div className="relative h-48">
          <Image
            alt="project cover"
            className={cn(
              // 'object-cover transition-all hover:scale-105',
              'object-cover',
            )}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={images.find(({ cover }) => cover)!.url}
          />
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className="" variant="gray">
            {/* @ts-expect-error */}
            {t(`type.${project.type}`)}
          </Badge>
          <Badge className="" variant="gray">
            {/* @ts-expect-error */}
            {t(`status.${project.status}`)}
          </Badge>
        </div>
      </div>
      <CardContent className="relative p-4">
        {!project.nyala_tokenized_asset_id && (
          <div className="absolute top-0 left-0 z-10 flex size-full items-center justify-center">
            <span className="-rotate-45 rounded-lg bg-[#e9c469] px-4 py-2 text-2xl font-bold text-white opacity-70 sm:text-4xl">
              {t('coming-soon')}
            </span>
          </div>
        )}
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          {translations.name}
        </h2>
        <div className="mb-4 flex items-center justify-between gap-1">
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-1 size-4" />
            <p>
              {translations.city}, {translations.state}, {translations.country}
            </p>
          </div>
          <CountryFlag code="es" />
        </div>
        <div className="mb-4 grid grid-cols-3 text-sm">
          <div className="flex flex-col items-center border-r">
            <Coins className="mb-2 size-5 text-primary" />
            <p className="font-semibold text-gray-800">
              {currencyFormatter.format(project.token_price / 100)}
            </p>
            <p className="text-center text-xs text-gray-600">
              {t('TokenPrice')}
            </p>
          </div>

          <div className="flex flex-col items-center border-r">
            <TrendingUp className="mb-2 size-5 text-primary" />
            <p className="font-semibold text-gray-800">
              {numberFormatter.format(project.profitability / 100)}%
            </p>
            <p className="text-center text-xs text-gray-600">
              {t('ExpectedReturn')}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <CalendarClock className="mb-2 size-5 text-primary" />
            <p className="font-semibold text-gray-800">
              {t('termValue', { term: project.term })}
            </p>
            <p className="text-center text-xs text-gray-600">
              {t('EstimatedTerm')}
            </p>
          </div>
        </div>

        {/* <div className="mb-4 flex items-center justify-center rounded-lg bg-secondary p-3 text-white">
          <TrendingUp className="mr-2 size-6" />
          <div className="text-center">
            <div className="text-2xl font-bold">{project.profitability}%</div>
            <div className="text-sm">Rentabilidad esperada</div>
          </div>
        </div> */}

        <Progress value={progress} className="mb-2 h-2.5 bg-gray-200" />
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <p>
              {t.rich('investors', {
                investors,
                span: (chunks) => (
                  <span className="font-semibold text-gray-800">{chunks}</span>
                ),
              })}
            </p>
          </div>
          <p>
            {t.rich('remainingTokens', {
              tokens: remainingTokens,
              span: (chunks) => (
                <span className="font-semibold text-gray-800">{chunks}</span>
              ),
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-4">{children}</CardFooter>
    </Card>
  )
}
