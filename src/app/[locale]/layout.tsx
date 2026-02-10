import { auth } from '@/auth/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import SessionProvider from '@/contexts/session-provider'
import { selectUserWithPersonalData } from '@/dal/user/queries/select-user-with-personaldata'
import { routing } from '@/i18n/routing'
import { setDateFnsDefaultOptions } from '@/utils/locale'
import { origin } from '@/utils/server-origin'
import { GoogleTagManager } from '@next/third-parties/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ReactNode } from 'react'
import '../globals.css'
import { BootIntercom } from './boot-intercom'
import SetDateFnsDefaultOptionsOnClient from './set-datefns-defaultoptions-on-client'

type Props = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata(_: Omit<Props, 'children'>) {
  const t = await getTranslations('home.layout')
  return {
    description: t('description'),
    icons: {
      icon: [
        { sizes: '32x32', type: 'image/png', url: '/img/tokenkey-32x32.png' },
      ],
    },
    metadataBase: new URL(origin),
    openGraph: {
      description: t('description'),
      images: [
        {
          alt: 'TokenKey',
          height: 630,
          url: '/img/metadata/og.png',
          width: 1200,
        },
      ],
      // locale: 'es',
      siteName: 'TokenKey',
      title: t('title'),
      // type: 'website',
      // url: 'https://tokenkey.io',
    },
    title: t('title'),
    twitter: {
      card: 'summary_large_image',
      // creator: 'https://www.linkedin.com/company/tokenkey',
      description: t('description'),
      images: [
        {
          alt: 'TokenKey',
          height: 630,
          url: '/img/metadata/og.png',
          width: 1200,
        },
      ],
      title: t('title'),
    },
  }
}

// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#add-generatestaticparams
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(props: Readonly<Props>) {
  const { locale } = await props.params
  const { children } = props

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) notFound()

  // https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#add-setrequestlocale-to-all-relevant-layouts-and-pages
  // https://next-intl.dev/blog/next-intl-3-0#static-rendering-of-server-components
  // Enable static rendering
  setRequestLocale(locale)

  setDateFnsDefaultOptions(locale)

  const session = await auth()

  const [messages, user] = await Promise.all([
    // Providing all messages to the client
    // side is the easiest way to get started
    getMessages(),
    session ? selectUserWithPersonalData() : null,
  ])

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        {!!process.env.VERCEL_ENV && (
          <>
            <Script id="gtm-consent" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                    dataLayer.push(arguments);
                }
                gtag("consent", "default", {
                    ad_storage: "denied",
                    ad_user_data: "denied", 
                    ad_personalization: "denied",
                    analytics_storage: "denied",
                    functionality_storage: "denied",
                    personalization_storage: "denied",
                    security_storage: "granted",
                    wait_for_update: 2000,
                });
                gtag("set", "ads_data_redaction", true);
                gtag("set", "url_passthrough", true);
              `}
            </Script>
            <GoogleTagManager
              auth={process.env.GOOGLE_TAG_MANAGER_AUTH!}
              gtmId={process.env.GOOGLE_TAG_MANAGER_ID!}
              preview={process.env.GOOGLE_TAG_MANAGER_PREVIEW!}
            />
            <Script
              src={`https://cdn-cookieyes.com/client_data/${process.env.COOKIEYES_WEBSITE_KEY}/script.js`}
              strategy="beforeInteractive"
            />
          </>
        )}
      </head>
      <body
        // className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen w-full flex-col`}
        className="flex min-h-screen w-full flex-col"
      >
        <noscript>
          <iframe
            className="invisible hidden"
            height="0"
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG_MANAGER_ID}`}
            width="0"
          />
        </noscript>
        <SetDateFnsDefaultOptionsOnClient locale={locale} />
        <BootIntercom
          appId={process.env.INTERCOM_APP_ID!}
          personalData={user?.personal_data ?? null}
          user={user}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
            enableSystem
          >
            <SessionProvider initialSession={session}>
              {children}
            </SessionProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
