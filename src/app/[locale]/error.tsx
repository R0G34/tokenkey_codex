'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('❌', error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="border-0 shadow-lg">
        <CardContent className="space-y-6 pt-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-slate-100">
                <TriangleAlert className="size-8 text-slate-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-800">
                {t('title')}
              </h3>
              <p className="mb-4 max-w-md text-slate-600">
                {t('p')}
                {error.digest && (
                  <span className="mt-2 block text-xs text-slate-500">
                    {t('error-code')} {error.digest}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
          <Button onClick={() => window.history.back()} variant="outline">
            {t('back-button')}
          </Button>
          <Button onClick={() => reset()}>
            <RefreshCw className="mr-2 size-4" />
            {t('retry-button')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
