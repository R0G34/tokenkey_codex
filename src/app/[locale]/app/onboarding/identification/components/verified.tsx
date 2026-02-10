'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { renewSession } from '@/utils/authjs/renew-session'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Verified() {
  const router = useRouter()
  const t = useTranslations('onboarding.kyc.verified')

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex size-24 items-center justify-center rounded-full bg-primary/15">
        <Check className="size-12 text-primary" />
      </div>

      <h3 className="mb-2 text-center text-xl font-medium text-slate-800">
        {t('title')}
      </h3>
      <p className="max-w-md text-center text-slate-600">{t('subtitle')}</p>

      <div className="my-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h4 className="mb-1 font-medium text-slate-800">{t('idVerified')}</h4>
          <p className="text-xs text-slate-500">{t('idConfirmed')}</p>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h4 className="mb-1 font-medium text-slate-800">
            {t('secureAccount')}
          </h4>
          <p className="text-xs text-slate-500">{t('completeAccess')}</p>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
            </svg>
          </div>
          <h4 className="mb-1 font-medium text-slate-800">
            {t('readyToInvest')}
          </h4>
          <p className="text-xs text-slate-500">{t('explore')}</p>
        </div>
      </div>

      <Button
        onClick={async () => {
          await renewSession({ onboardingCompleted: true })
          // window.location.href = '/app/projects'
          router.push('/app/projects')
        }}
      >
        {t('cta')}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
