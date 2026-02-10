'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useSignOut } from '@/hooks/use-sign-out'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function NavUserLogout() {
  const { signOut } = useSignOut()
  const t = useTranslations()

  const handleOnClick = () => signOut()

  return (
    <DropdownMenuItem onClick={handleOnClick}>
      <LogOut />
      {t('logout')}
    </DropdownMenuItem>
  )
}
