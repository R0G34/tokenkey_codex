import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import HighlightedProjects from './highlighted-projects'
import NewsletterSubscribe from './newsletter-subscribe'
import ProfitabilityCalculator from './profitability-calculator'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage(props: Props) {
  const { locale } = await props.params

  const t = await getTranslations('home.page')

  return (
    <>
      <div className="relative">
        <Image
          alt="banner"
          className="absolute right-0 !left-auto h-full !w-auto object-cover lg:object-contain"
          priority
          fill
          src="/img/banner.png"
        />
        <div className="container py-4 md:py-20">
          <div className="relative flex w-full max-w-[800px] flex-col gap-4 pl-4 md:pl-12">
            <p className="text-3xl font-bold text-slate-700 md:text-5xl">
              {t('title')}
            </p>
            <p className="text-3xl font-bold text-primary md:text-5xl">
              {t('subtitle')}
            </p>
            <p className="max-w-[536px] text-xl font-light md:text-2xl">
              {t('subtitle2')}
            </p>
            <Link
              className={cn(
                'mt-6 mb-10 self-start',
                buttonVariants({ size: 'lg' }),
              )}
              href="/projects"
            >
              {t('cta')}
            </Link>
          </div>
          <div className="relative w-full md:pl-12">
            <NewsletterSubscribe variant="hero" />
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 md:gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-3xl font-bold text-slate-700 md:text-5xl">
            {t('highlightedProjects.title')}
          </p>
          <HighlightedProjects locale={locale} />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-3xl font-bold text-slate-700 md:text-5xl">
            {t('yieldSimulator.title')}
          </p>
          <ProfitabilityCalculator />
        </div>
      </div>
    </>
  )
}
