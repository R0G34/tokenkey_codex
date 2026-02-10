'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link, usePathname } from '@/i18n/navigation'
import { Rocket } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function NavGettingStarted() {
  const pathname = usePathname()
  const t = useTranslations('app.sidebar')
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('gettingStarted')}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              isActive={pathname.startsWith('/app/onboarding')}
              tooltip={t('onboarding')}
            >
              <Link href="/app/onboarding">
                <Rocket />
                {t('onboarding')}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
