import { Separator } from '@/components/ui/separator'
import { Linkedin, Youtube } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
// eslint-disable-next-line no-restricted-imports
import Link from 'next/link'

export const Footer = () => {
  const t = useTranslations('footer')

  const footerLinks = [
    {
      title: t('legalNotice'),
      href: '/imprint',
    },
    {
      title: t('terms'),
      href: '/terms-and-conditions',
    },
    {
      title: t('privacy'),
      href: '/privacy',
    },
    {
      title: t('cookie'),
      href: '/cookie',
    },
  ]

  return (
    <footer className="bg-accent-secondary px-4 sm:px-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center justify-start py-12">
          <Image
            alt="TokenKey's logo"
            className="size-auto"
            height={106.66}
            src="/img/logo/tokenkey-logo-white.png"
            width={320}
          />

          <div className="mt-6 flex items-center gap-5 text-white/70">
            <Link href="https://www.youtube.com/@Tokenkey_io" target="_blank">
              <Youtube className="h-5 w-5 hover:text-white" />
              {/* <Image
                alt="Youtube logo"
                height={20}
                src="/img/logo/youtube-logo.svg"
                width={20}
              /> */}
            </Link>
            <Link
              href="https://www.linkedin.com/company/tokenkey"
              target="_blank"
            >
              <Linkedin className="h-5 w-5 hover:text-white" />
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="text-sm font-medium text-white/70 hover:text-white"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-justify text-sm whitespace-pre-wrap text-white/70">
            {t.rich('text', {
              concedus: (chunks) => (
                <a
                  className="hover:text-white"
                  href="https://www.concedus.com"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              link: (chunks) => (
                <a
                  className="hover:text-white"
                  href={`${chunks}`}
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <Separator className="bg-white/70" />

        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
          <span className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} TokenKey
            <span className="cky-banner-element ml-4 cursor-pointer hover:text-white">
              {t('cookiePreferences')}
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}
