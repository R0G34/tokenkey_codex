'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useSignOut } from '@/hooks/use-sign-out'
import { useTranslations } from 'next-intl'

export default function LogoutMenuItem() {
  const { signOut } = useSignOut()
  const t = useTranslations()

  const handleOnClick = () => signOut()

  return (
    // <button
    //   className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //   onClick={handleOnClick}
    // >
    //   Salir
    // </button>
    <DropdownMenuItem className="cursor-pointer" onClick={handleOnClick}>
      {t('logout')}
      {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
    </DropdownMenuItem>
  )
}
