'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { NavGettingStarted } from './nav-getting-started'
import { NavMain } from './nav-main'
import { NavSettings } from './nav-settings'
import { NavUser } from './nav-user'
import { SidebarHelp } from './sidebar-help'

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: Tables<'user'> & { personal_data: Tables<'personal_data'> | null }
}

export function AppSidebar({ user, ...props }: Props) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher /> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link
                className="relative flex h-12 w-[271px] items-center md:w-56"
                href="/"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ArrowLeft className="size-5" />
                </div>
                {state === 'expanded' && (
                  <Image
                    alt="TokenKey"
                    className="object-contain"
                    fill
                    priority
                    src="/img/logo-tokenkey.png"
                    sizes="224px"
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavAccount /> */}
        {user.personal_data?.kyc ? null : <NavGettingStarted />}
        <NavMain />
        {/* <NavProjects /> */}
        <div className="my-auto p-2 group-data-[collapsible=icon]:hidden">
          <SidebarHelp />
        </div>
        <NavSettings className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
