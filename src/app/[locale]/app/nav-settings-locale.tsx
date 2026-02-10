'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Check, Flag, Globe, MoreHorizontal } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Locale, useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ComponentPropsWithoutRef, useTransition } from 'react'
import { updateLocale } from '../actions'

export function NavSettingsLocale({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar()
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { data: session } = useSession()
  const pathname = usePathname()
  const params = useParams()

  const handleClick = (_locale: Locale) => {
    const nextLocale = _locale as Locale
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
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton asChild tooltip="Language">
            <span className="cursor-pointer">
              <Globe />
              <span>{t('title')}</span>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
                <span className="sr-only">{t('more')}</span>
              </SidebarMenuAction>
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          {routing.locales.map((cur) => (
            <DropdownMenuItem
              key={cur}
              disabled={isPending}
              onClick={() => handleClick(cur)}
            >
              {cur === locale ? (
                <Check className="text-muted-foreground" />
              ) : (
                <Flag className="text-muted-foreground" />
              )}
              {t('locale', { locale: cur })}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
