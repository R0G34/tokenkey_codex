'use client'

import LocaleError from '@/app/[locale]/error'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <LocaleError error={error} reset={reset} />
}
