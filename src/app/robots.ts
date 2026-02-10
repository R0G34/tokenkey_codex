import { origin } from '@/utils/server-origin'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // # Allow all crawlers to access the root.
      allow: '/',
      disallow: [
        // # Block access to /[locale]/app directory and everything under.
        '/*/app/',
        '/*/app/*',
        // # Block access to /[locale]/auth directory and everything under.
        '/*/auth/',
        '/*/auth/*',
        // # Block access to /api directory and everything under.
        '/api/',
        '/api/*',
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  }
}
