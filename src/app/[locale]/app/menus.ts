import { Building, CircleDollarSign, Inbox, LucideIcon } from 'lucide-react'

// export type MessageKey = Parameters<
//   ReturnType<typeof useTranslations<never>>
// >[0]

export type Menu = {
  // href: keyof (typeof routing)['pathnames']
  href: string
  icon: LucideIcon
  title: string
  // title: Parameters<ReturnType<typeof useTranslations>>[number]
  // title: MessageKey
}

export const menus: Menu[] = [
  {
    href: '/app/projects',
    icon: Building,
    title: 'projects',
  },
  {
    href: '/app/investments',
    icon: CircleDollarSign,
    title: 'investments',
  },
  // {
  //   href: '/app/portfolio',
  //   icon: PieChart,
  //   title: 'portfolio',
  // },
  {
    href: '/app/inbox',
    icon: Inbox,
    title: 'inbox',
  },
  // {
  //   href: '/app/crypto-wallet',
  //   icon: Coins,
  //   title: 'cryptowallet',
  // },
  //   {
  //     href: '/app/personal-data',
  //     icon: User,
  //     title: 'personalData',
  //   },
  //   // {
  //   //   href: '/app/help',
  //   //   icon: HelpCircle,
  //   //   title: 'Ayuda ,
  //   // },
  //   // {
  //   //   href: '/app/email',
  //   //   icon: ,
  //   //   title: 'Email',
  //   // },
]
