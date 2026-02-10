import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // locales: ['de', 'en', 'es'],
  // defaultLocale: 'es',
  locales: ['de', 'en'],
  defaultLocale: 'en',
  // By setting this to `false`, the cookie as well as the `accept-language` header will no longer be used for locale detection.
  // localeDetection: true,
  pathnames: {
    '/': '/',
    '/auth/signin': '/auth/signin',
    '/auth/signup': '/auth/signup',
    '/auth/verify-otp': {
      de: '/auth/uberprufungscode',
      en: '/auth/verify-otp',
      es: '/auth/verificar-codigo',
    },
    // '/about': {
    //   de: '/uber-uns',
    //   en: '/about',
    //   es: '/nosotros',
    // },
    // '/how-it-works': {
    //   de: '/wie-es-funktioniert',
    //   en: '/how-it-works',
    //   es: '/como-funciona',
    // },
    '/privacy': {
      de: '/datenschutz',
      en: '/privacy',
      es: '/privacidad',
    },
    '/imprint': {
      de: '/impressum',
      en: '/imprint',
      es: '/aviso-legal',
    },
    '/cookie': '/cookie',
    '/terms-and-conditions': {
      de: '/allgemeine-geschaeftsbedingungen',
      en: '/terms-and-conditions',
      es: '/terminos-y-condiciones',
    },
    '/projects': {
      de: '/projekte',
      en: '/projects',
      es: '/proyectos',
    },
    '/app/onboarding': '/app/onboarding',
    // '/app/onboarding': {
    //   de: '/app/onboarding',
    //   en: '/app/onboarding',
    //   es: '/app/incorporacion',
    // },
    '/app/onboarding/company': {
      de: '/app/onboarding/unternehmen',
      en: '/app/onboarding/company',
      es: '/app/onboarding/compania',
    },
    '/app/onboarding/personal-data': {
      de: '/app/onboarding/personliche-daten',
      en: '/app/onboarding/personal-data',
      es: '/app/onboarding/datos-personales',
    },
    '/app/onboarding/pep': '/app/onboarding/pep',
    '/app/onboarding/wphg': '/app/onboarding/wphg',
    '/app/onboarding/wphg/knowledge': {
      de: '/app/onboarding/wphg/knowledge',
      en: '/app/onboarding/wphg/knowledge',
      es: '/app/onboarding/wphg/conocimiento',
    },
    '/app/onboarding/wphg/professional': {
      de: '/app/onboarding/wphg/professional',
      en: '/app/onboarding/wphg/professional',
      es: '/app/onboarding/wphg/profesional',
    },
    '/app/onboarding/wphg/risk-warning': {
      de: '/app/onboarding/wphg/risikohinweis',
      en: '/app/onboarding/wphg/risk-warning',
      es: '/app/onboarding/wphg/advertencia-de-riesgo',
    },
    '/app/onboarding/ubo-aml': {
      de: '/app/onboarding/ubo-aml',
      en: '/app/onboarding/ubo-aml',
      es: '/app/onboarding/ubo-aml',
    },
    '/app/onboarding/ubo-aml/beneficial-owners': {
      de: '/app/onboarding/ubo-aml/beneficial-owners',
      en: '/app/onboarding/ubo-aml/beneficial-owners',
      es: '/app/onboarding/ubo-aml/propietarios-beneficiarios',
    },
    '/app/onboarding/ubo-aml/documents': '/app/onboarding/ubo-aml/documents',
    '/app/onboarding/custody': {
      de: '/app/onboarding/verwahrun',
      en: '/app/onboarding/custody',
      es: '/app/onboarding/custodia',
    },
    '/app/onboarding/identification': {
      de: '/app/onboarding/identification',
      en: '/app/onboarding/identification',
      es: '/app/onboarding/identificacion',
    },
    '/app/onboarding/identification/result':
      '/app/onboarding/identification/result',
    '/app/account': {
      de: '/app/account',
      en: '/app/account',
      es: '/app/cuenta',
    },
    '/app/account/edit-details': {
      de: '/app/account/edit-details',
      en: '/app/account/edit-details',
      es: '/app/cuenta/edit-details',
    },
    '/app/account/edit-company': {
      de: '/app/account/edit-company',
      en: '/app/account/edit-company',
      es: '/app/cuenta/edit-company',
    },
    '/app/account/edit-ubo-aml': {
      de: '/app/account/edit-ubo-aml',
      en: '/app/account/edit-ubo-aml',
      es: '/app/cuenta/edit-ubo-aml',
    },
    '/app/account/edit-experience': {
      de: '/app/account/edit-experience',
      en: '/app/account/edit-experience',
      es: '/app/cuenta/edit-experience',
    },
    '/app/inbox': {
      de: '/app/inbox',
      en: '/app/inbox',
      es: '/app/inbox',
    },
    '/app/inbox/[id]': {
      de: '/app/inbox/[id]',
      en: '/app/inbox/[id]',
      es: '/app/inbox/[id]',
    },
    '/app/projects': {
      de: '/app/projekte',
      en: '/app/projects',
      es: '/app/proyectos',
    },
    '/app/projects/[code]': {
      de: '/app/projekte/[code]',
      en: '/app/projects/[code]',
      es: '/app/proyectos/[code]',
    },
    '/app/projects/[code]/invest': {
      de: '/app/projekte/[code]/invest',
      en: '/app/projects/[code]/invest',
      es: '/app/proyectos/[code]/invest',
    },
    '/app/portfolio': {
      de: '/app/portfolio',
      en: '/app/portfolio',
      es: '/app/cartera',
    },
    '/app/crypto-wallet': {
      de: '/app/krypto-wallet',
      en: '/app/crypto-wallet',
      es: '/app/criptowallet',
    },
    '/app/personal-data': {
      de: '/app/personliche-daten',
      en: '/app/personal-data',
      es: '/app/datos-personales',
    },
    '/app/help': {
      de: '/app/helfen',
      en: '/app/help',
      es: '/app/ayuda',
    },
    '/app/investments/[id]': {
      de: '/app/investitionen/[id]',
      en: '/app/investments/[id]',
      es: '/app/inversiones/[id]',
    },
    '/app/investments': {
      de: '/app/investitionen',
      en: '/app/investments',
      es: '/app/inversiones',
    },
  },
})
