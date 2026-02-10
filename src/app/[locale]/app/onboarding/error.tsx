'use client'

import LocaleError from '@/app/[locale]/error'

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <LocaleError error={error} reset={reset} />
}
