'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Locale } from 'next-intl'
import { useParams } from 'next/navigation'
import { ChangeEvent, ReactNode, useTransition } from 'react'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

export default function LocaleSwitcherSelect1({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  return (
    <label
      className={cn(
        'relative text-gray-400',
        isPending && 'transition-opacity disabled:opacity-30',
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none bg-transparent py-3 pr-6 pl-2"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          const nextLocale = event.target.value as Locale
          startTransition(() => {
            // @ts-expect-error
            router.push(pathname, { locale: nextLocale })
            router.refresh()
          })
        }}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute top-[8px] right-2">⌄</span>
    </label>
  )
}
