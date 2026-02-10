import { auth } from '@/auth/auth'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { CircleUser } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import NavLink from './navlink'

export default async function UserMenu({
  t,
}: {
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  const session = await auth()

  if (!session)
    return (
      <NavLink
        href="/api/auth/signin?callbackUrl=/app/projects"
        asButton
        i18n={false}
      >
        {t('yourAccount')}
      </NavLink>
    )

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href="/app/projects"
          className={cn(buttonVariants({ size: 'icon' }), 'rounded-full')}
        >
          <CircleUser className="size-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {t('startApp')}
      </TooltipContent>
    </Tooltip>
  )
}
