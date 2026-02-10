'use client'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { cn } from '@/utils/tailwind/cn'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  className?: string
  project: Tables<'project'>
}

export default function InvestmentLink({ className = '', project }: Props) {
  const t = useTranslations('investment')

  return (
    <Link
      className={cn(
        'w-full',
        buttonVariants({ size: 'lg' }),
        project.secupay_contract_id ? '' : 'pointer-events-none opacity-50',
      )}
      href={{
        pathname: '/app/projects/[code]/invest',
        params: { code: project.code.toLowerCase() },
      }}
    >
      {t('investmentCard.investNow')}
      <ArrowRight className="ml-2 size-4" />
    </Link>
  )
}
