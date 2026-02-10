'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import NewsletterSubscribeForm from './newsletter-subscribe-form'

interface Props {
  variant: 'hero' | 'footer'
}

export default function NewsletterSubscribe({ variant }: Props) {
  const t = useTranslations('home.newsletter')

  if (variant === 'hero') {
    return (
      <Card className="max-w-md p-0">
        <CardContent className="p-4">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Bell className="size-5 text-primary" />
            <span className="hidden md:block">{t('mdTitle')}</span>
            <span className="text-base md:hidden">{t('mdTitle')}</span>
          </h3>
          <NewsletterSubscribeForm buttonText={t('heroCta')} variant="hero" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold">{t('mdTitle')}</h3>
      <NewsletterSubscribeForm buttonText={t('cta')} variant="footer" />
    </div>
  )
}
