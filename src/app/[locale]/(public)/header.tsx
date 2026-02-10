import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import LocaleSwitcher from '../locale-switcher'
// import LocaleSwitcher1 from '../LocaleSwitcher1'
import { Locale, useTranslations } from 'next-intl'
import { Suspense } from 'react'
import NavLink from './navlink'
import UserMenu from './user-menu'

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('navbar')

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background">
      {/* <div className="container flex h-14 items-center"> */}
      <div className="container flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <VisuallyHidden.Root>
            <SheetHeader>
              <SheetTitle>Nav Content</SheetTitle>
              <SheetDescription className="flex h-[300px] flex-col items-center justify-between">
                desc
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden.Root>
          <SheetContent side="left">
            <nav className="grid gap-6 p-4 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Image
                  alt="TokenKey's logo"
                  height={39}
                  src="/img/logo-tokenkey.png"
                  width={117}
                />
                <span className="sr-only">TokenKey</span>
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                // @ts-expect-error
                href="https://help.tokenkey.io"
                target="_blank"
              >
                {t('howItWorks')}
              </Link>
              {/* <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground"
              >
                Nosotros
              </Link> */}
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-foreground"
              >
                {t('marketplace')}
              </Link>
              {/* <LocaleSwitcher1 /> */}
              <LocaleSwitcher />
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="flex w-full justify-center gap-6 text-lg font-medium md:items-center md:justify-between md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image
              alt="TokenKey's logo"
              className="h-12 w-36"
              height={48}
              src="/img/logo-tokenkey.png"
              width={144}
            />
            <span className="sr-only">TokenKey</span>
          </Link>
          <div className="hidden flex-col justify-between gap-6 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
            <NavLink
              href={`https://help.tokenkey.io/${locale}`}
              target="_blank"
            >
              {t('howItWorks')}
            </NavLink>
            {/* <IntercomOpener /> */}
            {/* <NavLink href="/about">Nosotros</NavLink> */}
            <NavLink href="/projects">{t('marketplace')}</NavLink>
            {/* <LocaleSwitcher1 /> */}
            <LocaleSwitcher />
          </div>
        </nav>

        <div className="flex items-center justify-end md:ml-auto md:w-auto md:justify-normal md:gap-4 lg:gap-4">
          <div className="md:ml-4">{/* <ModeToggle /> */}</div>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu t={t} />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
