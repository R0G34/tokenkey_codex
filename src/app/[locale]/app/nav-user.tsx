'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Tables } from '@/lib/supabase/types/database.types'
import { BadgeCheck, Bell, ChevronsUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NavUserLogout } from './nav-user-logout'
import { Link } from '@/i18n/navigation'

export function NavUser({
  user,
}: {
  user: Tables<'user'> & { personal_data: Tables<'personal_data'> | null }
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations('app.sidebar')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={user.avatar_url ?? ''}
                  alt={user.personal_data?.forename ?? user.email}
                />
                <AvatarFallback className="rounded-lg">
                  {user.personal_data?.forename
                    ? [
                        user.personal_data?.forename,
                        user.personal_data?.surname,
                      ]
                        .map((w) => w.charAt(0).toUpperCase())
                        .join('')
                    : user.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.personal_data?.forename ?? user.email.split('@')[0]}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar_url ?? ''}
                    alt={user.personal_data?.forename ?? user.email}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.personal_data?.forename
                      ? [
                          user.personal_data.forename,
                          user.personal_data.surname,
                        ]
                          .map((w) => w.charAt(0).toUpperCase())
                          .join('')
                      : user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.personal_data?.forename ?? user.email.split('@')[0]}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/app/account">
                  <BadgeCheck />
                  {t('account')}
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Bell />
                {t('notifications')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <NavUserLogout />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
