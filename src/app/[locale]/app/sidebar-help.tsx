'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/utils/tailwind/cn'
import { show } from '@intercom/messenger-js-sdk'
import {
  ChevronRight,
  HelpCircle,
  HelpCircleIcon,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ComponentPropsWithoutRef } from 'react'

const PHONE_NUMBER_NO_SPACES =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER!.replace(/\s/g, '')

export function SidebarHelp({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Card>) {
  // return <V1 className={className} {...props} />
  return <V2 className={className} {...props} />
  // return <V3 className={className} {...props} />
}

function V1({ className, ...props }: ComponentPropsWithoutRef<typeof Card>) {
  const t = useTranslations('onboarding.help')

  return (
    <Card
      {...props}
      className={cn('border-2 border-[#F4A362] shadow-none', className)}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm text-[#F4A362]">{t('title')}</CardTitle>
        {/* <CardDescription>
            Opt-in to receive updates and news about the sidebar.
          </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <a
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          href={`https://wa.me/${PHONE_NUMBER_NO_SPACES}?text=${t('whatsapp')}`}
          target="_blank"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>
        <button
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          onClick={() => show()}
        >
          <MessageSquare className="size-4" />
          {t('intercom')}
        </button>
        <a
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          href={`tel:${PHONE_NUMBER_NO_SPACES}`}
        >
          <Phone className="size-4" />
          {process.env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER!}
        </a>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Mail className="size-4" />
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}
        </a>
      </CardContent>
    </Card>
  )
}

export function V2({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Card>) {
  const t = useTranslations('onboarding.help')

  const data = {
    title: 'Building Your Application',
    url: '#',
    items: [
      {
        id: 1,
        href: `https://wa.me/${PHONE_NUMBER_NO_SPACES}?text=${t('whatsapp')}`,
        onClick: undefined,
        title: (
          <>
            <MessageCircle className="size-4" />
            WhatsApp
          </>
        ),
      },
      {
        id: 2,
        href: undefined,
        onClick: () => show(),
        title: (
          <>
            <MessageSquare className="size-4" />
            {t('intercom')}
          </>
        ),
      },
      {
        id: 3,
        href: `tel:${PHONE_NUMBER_NO_SPACES}`,
        onClick: undefined,
        title: (
          <>
            <Phone className="size-4" />
            {process.env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER!}
          </>
        ),
      },
      {
        id: 4,
        href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}`,
        onClick: undefined,
        title: (
          <>
            <Mail className="size-4" />
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}
          </>
        ),
      },
    ],
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span className="font-medium text-[#F4A362]">
              <HelpCircle />
              {t('title')}
            </span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            {data.items.map((item) => (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton asChild>
                  <a
                    className="cursor-pointer"
                    href={item.href}
                    onClick={item.onClick}
                    target="_blank"
                  >
                    {item.title}
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function V3({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Card>) {
  const t = useTranslations('onboarding.help')

  const data = {
    title: 'Building Your Application',
    url: '#',
    items: [
      {
        id: 1,
        href: `https://wa.me/${PHONE_NUMBER_NO_SPACES}?text=${t('whatsapp')}`,
        onClick: undefined,
        title: (
          <>
            <MessageCircle className="size-4" />
            WhatsApp
          </>
        ),
      },
      {
        id: 2,
        href: undefined,
        onClick: () => show(),
        title: (
          <>
            <MessageSquare className="size-4" />
            {t('intercom')}
          </>
        ),
      },
      {
        id: 3,
        href: `tel:${PHONE_NUMBER_NO_SPACES}`,
        onClick: undefined,
        title: (
          <>
            <Phone className="size-4" />
            {process.env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER!}
          </>
        ),
      },
      {
        id: 4,
        href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}`,
        onClick: undefined,
        title: (
          <>
            <Mail className="size-4" />
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL!}
          </>
        ),
      },
    ],
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className="font-medium text-[#F4A362]"
                tooltip={t('title')}
              >
                {<HelpCircleIcon />}
                <span>{t('title')}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {data.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton asChild>
                      <a
                        className="cursor-pointer"
                        href={subItem.href}
                        onClick={subItem.onClick}
                        target="_blank"
                      >
                        {subItem.title}
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
