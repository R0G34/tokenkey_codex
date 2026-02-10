'use client'

import { buttonVariants } from '@/components/ui/button'
import { Link as I18nLink, usePathname } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
// eslint-disable-next-line no-restricted-imports
import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  asButton?: boolean
  href: any
  i18n?: boolean
  target?: string
}

export default function NavLink({
  asButton,
  children,
  href,
  i18n = true,
  target = '_self',
}: Props) {
  const pathname = usePathname()

  if (i18n)
    return (
      <I18nLink
        href={href}
        className={cn(
          'shrink-0 transition-colors',
          asButton
            ? buttonVariants({ variant: 'secondary' })
            : pathname === href
              ? ''
              : 'text-muted-foreground hover:text-foreground',
        )}
        target={target}
      >
        {children}
      </I18nLink>
    )

  return (
    <Link
      href={href}
      className={cn(
        'shrink-0 transition-colors',
        asButton
          ? buttonVariants({ variant: 'secondary' })
          : pathname === href
            ? ''
            : 'text-muted-foreground hover:text-foreground',
      )}
      target={target}
    >
      {children}
    </Link>
  )
}
