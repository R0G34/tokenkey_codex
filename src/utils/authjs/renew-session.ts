'use server'

import { CookieOptions } from '@supabase/ssr'
import { encode, getToken, JWT } from 'next-auth/jwt'
import { cookies, headers } from 'next/headers'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const renewSession = async (values: Partial<JWT>) => {
  const headersList = await headers()
  const secure = !!process.env.VERCEL_ENV
  const token = await getToken({
    req: { headers: Object.fromEntries(headersList) },
    secret: process.env.AUTH_SECRET!,
    secureCookie: secure,
  })

  if (!token) redirect('/api/auth/signin')

  const newToken: JWT = { ...token, ...values }

  const key = secure ? '__Secure-authjs.session-token' : 'authjs.session-token'

  const value = await encode({
    salt: key,
    secret: process.env.AUTH_SECRET!,
    token: newToken,
  })

  const options: CookieOptions = {
    httpOnly: true,
    maxAge: 2592000, // authjs default
    // expires
    secure,
  }

  const cookieStore = await cookies()

  cookieStore.set(key, value, options)
}
