import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

// Middleware only supports Edge runtime. The Node.js runtime cannot be used.

// https://nextjs.org/docs/app/api-reference/file-conventions/middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware
// https://nextjs.org/docs/app/building-your-application/authentication

const intlMiddleware = createMiddleware(routing)

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // console.log(
  //   request.referrer,
  //   request.cookies,
  //   request.credentials,
  //   request.headers,
  //   request.url,
  //   '🔥',
  //   Date.now(),
  // )

  // Run the internationalization middleware
  const response = intlMiddleware(request)

  // If the internationalization middleware returned a response, return it
  // if (response) return response
  // If the internationalization middleware redirected, return early
  if (response.status !== 200) return response

  const path = request.nextUrl.pathname

  const locale = path.split('/')[1] || routing.defaultLocale

  // Protected routes
  const onboardingRoute = `/${locale}/app/onboarding`
  const isOnboardingRoute = path.startsWith(onboardingRoute)
  const isAppRoute = path.startsWith(`/${locale}/app`)

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET!,
    secureCookie: !!process.env.VERCEL_ENV,
  })

  // Check authentication and redirect if needed
  if (!token && isAppRoute) {
    // return NextResponse.redirect(new URL('/auth/signin', request.url))
    return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url))
  }

  // Always redirect to user locale preference.
  if (token?.locale && token.locale !== locale) {
    // return NextResponse.redirect(
    //   new URL(`/${token.locale}${path.substring(3)}`, request.url),
    // )
    // Handle disabled Spanish locale - redirect to English instead
    const targetLocale = token.locale === 'es' ? 'en' : token.locale
    if (targetLocale !== locale) {
      return NextResponse.redirect(
        new URL(`/${targetLocale}${path.substring(3)}`, request.url),
      )
    }
  }

  // Redirect if onboarding is incomplete but trying to access app
  if (token && !token.onboardingCompleted && isAppRoute && !isOnboardingRoute) {
    return NextResponse.redirect(
      new URL(`/${locale}/app/onboarding`, request.url),
    )
  }

  // Redirect if onboarding is complete but trying to access onboarding
  if (token?.onboardingCompleted && isOnboardingRoute) {
    return NextResponse.redirect(
      new URL(`/${locale}/app/projects`, request.url),
    )
  }

  // https://github.com/vercel/next.js/discussions/43657#discussioncomment-6720188
  // Handle onboarding step eligibility (only for onboarding routes)
  // -> not ideal to use db in middleware but only for onboarding would be ok.
  // if (token && isOnboardingRoute) {
  //   const { data: progress } = await supabase.from('user_progress')...
  //
  //   // Get the requested pathname (stripping locale if present)
  //   const cleanPath = path.replace(`/${locale}`, '').replace(/^\/+/, '/')
  //   const currentStepIndex = steps.findIndex(
  //     (step) => step.href === `${onboardingRoute}${cleanPath}`,
  //   )
  //
  //   // Find the first incomplete step
  //   const firstIncompleteStep =
  //     steps.find((step) => !step.completed) || steps[steps.length - 1]
  //   const allowedStepIndex = steps.indexOf(firstIncompleteStep)
  //
  //   // Redirect if trying to access a step beyond the first incomplete one
  //   if (currentStepIndex > allowedStepIndex) {
  //     return NextResponse.redirect(
  //       new URL(firstIncompleteStep.href, request.url),
  //     )
  //   }
  // }

  if (path.startsWith('/auth/')) {
    return NextResponse.redirect(new URL(`/${locale}/{path}`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // |auth
    '/((?!api|_next/static|_next/image|img|.well-known|external|legals|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
  //
  //
  //
  // matcher: '/about/:path*',
  //
  // matcher: ['/about', '/contact'],
  //
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    */
  //   '/((?!api|_next/static|_next/image|favicon.ico).*)',
  // ],
  //
  // matcher: [
  //   {
  //     source: '/api/*',
  //     regexp: '^/api/(.*)',
  //     locale: false,
  //     has: [
  //       { type: 'header', key: 'Authorization', value: 'Bearer Token' },
  //       { type: 'query', key: 'userId', value: '123' },
  //     ],
  //     missing: [{ type: 'cookie', key: 'session', value: 'active' }],
  //   },
  // ],
  //
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    */
  //   {
  //     source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  //     missing: [
  //       { type: 'header', key: 'next-router-prefetch' },
  //       { type: 'header', key: 'purpose', value: 'prefetch' },
  //     ],
  //   },
  //   {
  //     source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  //     has: [
  //       { type: 'header', key: 'next-router-prefetch' },
  //       { type: 'header', key: 'purpose', value: 'prefetch' },
  //     ],
  //   },
  //   {
  //     source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  //     has: [{ type: 'header', key: 'x-present' }],
  //     missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
  //   },
  // ],
  // matcher: '/auth/signin',
  //
  // matcher: [
  //   {
  //     source: '/(login.*)',
  //     // source: '/((login).*)',
  //     // source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
  //     has: [{ type: 'query', key: 'login', value: '1' }],
  //   },
  // ],
}
