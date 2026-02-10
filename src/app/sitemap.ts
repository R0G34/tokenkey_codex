import { routing } from '@/i18n/routing'
import { origin } from '@/utils/server-origin'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return Object.entries(routing.pathnames)
    .filter(([k]) => !k.startsWith('/auth/') && !k.startsWith('/app/'))
    .map(([k, v]) => {
      const changeFrequency = ['/', '/projects'].includes(k)
        ? 'monthly'
        : 'yearly'
      const priority = ['/', '/projects'].includes(k) ? 1 : 0.2
      // const path =
      //   typeof v === 'string' ? (v.endsWith('/') ? v.slice(0, -1) : v) : v.es
      // const url = `${origin}/es${path}`
      const path =
        typeof v === 'string' ? (v.endsWith('/') ? v.slice(0, -1) : v) : v.en
      const url = `${origin}/en${path}`
      const languages =
        typeof v === 'string'
          ? {
              de: `${origin}/de${path}`,
              en: `${origin}/en${path}`,
              // es: `${origin}/es${path}`,
            }
          : {
              de: `${origin}/de${v.de}`,
              en: `${origin}/en${v.en}`,
              // es: `${origin}/es${v.es}`,
            }

      return {
        url,
        lastModified,
        alternates: { languages },
        changeFrequency,
        priority,
      }
    })
}
