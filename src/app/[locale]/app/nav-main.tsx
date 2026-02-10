'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { menus } from './menus'

export function NavMain() {
  const pathname = usePathname()
  const t = useTranslations('app.sidebar')
  return (
    <SidebarGroup>
      <SidebarGroupLabel>App</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((menu) => (
          <SidebarMenuItem key={menu.title}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(menu.href)}
              tooltip={menu.title}
            >
              <Link
                // @ts-expect-error
                href={menu.href}
              >
                {menu.icon && <menu.icon />}
                {/* <span>{item.title}</span> */}
                {/* @ts-expect-error */}
                {t(menu.title)}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
