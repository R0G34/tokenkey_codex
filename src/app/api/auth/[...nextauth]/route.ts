import { handlers } from '@/auth/auth'
import { localeForAuthEmailCookieName } from '@/utils/authjs/locale-for-auth-email-cookie-name'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
// export const { GET, POST } = handlers

const { GET: authGET, POST: authPOST } = handlers

export const GET = authGET

export const POST = async (req: NextRequest) => {
  const cookieStore = await cookies()

  if (req.nextUrl.searchParams.has('signin_type'))
    cookieStore.set(
      'SignInType',
      req.nextUrl.searchParams.get('signin_type') ?? '',
    )
  else cookieStore.delete('SignInType')

  if (req.nextUrl.searchParams.has(localeForAuthEmailCookieName))
    cookieStore.set(
      localeForAuthEmailCookieName,
      req.nextUrl.searchParams.get(localeForAuthEmailCookieName) ?? '',
    )
  else cookieStore.delete(localeForAuthEmailCookieName)

  return authPOST(req)
}
