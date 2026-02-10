'use client'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { useSession } from 'next-auth/react'
import { Locale } from 'next-intl'
import { useParams } from 'next/navigation'
import { ReactNode, useTransition } from 'react'
import { updateLocale } from './actions'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const { data: session } = useSession()

  function onSelectChange(value: string) {
    const nextLocale = value as Locale
    startTransition(async () => {
      if (session) await updateLocale(nextLocale)

      // https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/components/LocaleSwitcherSelect.tsx
      // router.replace(
      //   // @ts-expect-error -- TypeScript will validate that only known `params`
      //   // are used in combination with a given `pathname`. Since the two will
      //   // always match for the current route, we can skip runtime checks.
      //   { pathname, params },
      //   { locale: nextLocale },
      // )

      // https://www.reddit.com/r/nextjs/comments/18hp15j/trouble_with_locale_switching_in_nextjs_14_using/
      //   https://github.com/ixartz/Next-js-Boilerplate/blob/main/src/components/LocaleSwitcher.tsx
      const url = Object.keys(params).reduce(
        (acc, k) => acc.replace(`[${k}]`, params[k] as string),
        pathname,
      )
      // @ts-expect-error
      // router.push(pathname, { locale: nextLocale })
      router.push(url, { locale: nextLocale })
      router.refresh()
    })
  }

  return (
    <Select
      defaultValue={defaultValue}
      disabled={isPending}
      onValueChange={onSelectChange}
    >
      <SelectTrigger
        className={cn(
          'w-28 text-gray-400',
          isPending && 'transition-opacity disabled:opacity-30',
        )}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  )
}
