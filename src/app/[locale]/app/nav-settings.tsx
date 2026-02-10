'use client'

import { Monitor, Moon, Paintbrush, Sun } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/utils/tailwind/cn'
import { useTranslations } from 'next-intl'
import { ComponentPropsWithoutRef } from 'react'
import { NavSettingsLocale } from './nav-settings-locale'

const settings = [
  {
    name: 'Apariencia',
    url: '#',
    icon: Paintbrush,
    items: [
      { name: 'Claro', url: '#', icon: Sun },
      { name: 'Oscuro', url: '#', icon: Moon },
      { name: 'Dispositivo', url: '#', icon: Monitor },
    ],
  },
]

export function NavSettings({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar()
  const t = useTranslations('app.sidebar')

  return (
    <SidebarGroup
      {...props}
      className={cn(/* 'group-data-[collapsible=icon]:hidden',  */ className)}
    >
      <SidebarGroupLabel>{t('settings.title')}</SidebarGroupLabel>
      <SidebarMenu>
        <NavSettingsLocale />
        {/* {settings.map((item) => (
          <SidebarMenuItem key={item.name}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </a>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                {item.items.map((subItem) => (
                  <DropdownMenuItem key={subItem.name}>
                    <subItem.icon className="text-muted-foreground" />
                    <span>{subItem.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))} */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
