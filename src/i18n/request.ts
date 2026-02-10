import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const messages = Object.assign(
    {},
    ...(
      await Promise.all([
        import(`./messages/${locale}.json`),
        import(`./messages/onboarding/${locale}.json`),
        import(`./messages/auth/${locale}.json`),
        import(`./messages/email/${locale}.json`),
        import(`./messages/home/${locale}.json`),
        import(`./messages/project/${locale}.json`),
        import(`./messages/not-found/${locale}.json`),
        import(`./messages/error/${locale}.json`),
        import(`./messages/country/${locale}.json`),
        import(`./messages/faq/${locale}.json`),
        import(`./messages/investment/${locale}.json`),
        import(`./messages/inbox/${locale}.json`),
        import(`./messages/app/${locale}.json`),
        import(`./messages/legals/${locale}.json`),
        import(`./messages/account/${locale}.json`),
      ])
    ).map((file) => file.default),
  )

  return {
    locale,
    messages,
  }
})
