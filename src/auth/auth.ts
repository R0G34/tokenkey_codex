import { getLocaleForAuthEmail } from '@/utils/authjs/get-locale-for-auth-email'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import ResendProvider from 'next-auth/providers/resend'
import { cookies } from 'next/headers'
import {
  adminCountUserByEmail,
  adminSelectUserLocaleAndKyc,
  adminUpdateUserLocale,
} from '../dal/auth'
import { sendWelcome } from '../utils/resend/send-welcome'
import { computeSupabaseJWT } from '../utils/supabase/compute-supabase-jwt'
import { generateWalletWithWeb3Auth } from '../utils/web3auth/generate-wallet'
import { otpConfig } from './auth-resend-config-otp'

// https://authjs.dev/getting-started/providers/credentials#custom-error-messages
// class EmailAlreadyUsedError extends CredentialsSignin {
//   code = 'EmailAlreadyUsed'
// }

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async jwt({ account, token, user, profile, session, trigger }) {
      if (trigger === 'signUp') {
        if (!account) throw new Error('account missing')
        if (!token.email) throw new Error('token.email missing')
        if (!user.id) throw new Error('user.id missing')
        const locale = await getLocaleForAuthEmail()
        await Promise.all([
          adminUpdateUserLocale(user.id, locale),
          generateWalletWithWeb3Auth(account, token.email, user.id),
          sendWelcome(token.email),
        ])
        return { ...token, locale, onboardingCompleted: false }
      }
      const { locale, personal_data } = await adminSelectUserLocaleAndKyc(
        token.sub!,
      )
      return { ...token, locale, onboardingCompleted: !!personal_data?.kyc }
    },
    /**
     * https://authjs.dev/guides/extending-the-session
     */
    async session({ session, user, newSession, token, trigger }) {
      session.supabaseAccessToken = await computeSupabaseJWT(
        token.sub!,
        token.exp!,
      )
      session.user.id = token.sub!
      // session.userId = token.sub!
      session.onboardingCompleted = token.onboardingCompleted
      session.locale = token.locale
      return session
    },
    // authorized(params) {
    //   console.log('🔥 authorized', { params })
    //   return true
    // },
    async signIn({ user, account, profile, credentials, email }) {
      if (!user.email) throw new Error('❌ user.email missing')

      const cookieStore = await cookies()
      const signInType = cookieStore.get('SignInType')?.value
      const existingUser = await adminCountUserByEmail(user.email)

      if (signInType === 'signup' && existingUser)
        // throw new EmailAlreadyUsedError()
        return '/auth/signup?error=EmailAlreadyUsed'

      if (signInType !== 'signup' && !existingUser)
        return '/auth/signin?error=EmailNotFound'

      // Allow to continue.
      return true
    },
    // async redirect({ url, baseUrl }) {
    //   console.log('🔥 redirect', { url, baseUrl })
    //   // If error thrown due to existing account, redirect to signin page
    //   // if (url.includes('error=Account+already+exists')) {
    //   //   console.log('🔥 redirect 1')
    //   //   return `${baseUrl}/signin?error=AccountExists`
    //   // }
    //   // console.log('🔥 redirect 2')
    //   return url
    //   // return baseUrl
    // },
  },
  // debug: true,
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // https://authjs.dev/guides/pages/error
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  /**
   * https://authjs.dev/reference/core/providers#allowdangerousemailaccountlinking
   * https://authjs.dev/reference/core/providers/google#notes
   */
  providers: [
    // Apple,
    // GitHub({
    //   allowDangerousEmailAccountLinking: true,
    //   // authorization: { params: { prompt: 'consent' } },
    // }),
    Google({
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          // access_type: 'offline',
          // prompt: 'consent',
          // response_type: 'code',
          // scope: 'openid profile email',
          // session: {
          //   strategy: 'jwt',
          // },
        },
      },
      // async profile(params, a) {
      //   console.log('🔥 Google profile', params, a)
      //   const { data } = params
      //   return params
      // },
    }),
    ResendProvider({
      from: 'TokenKey <no-reply@tokenkey.io>',
      maxAge: 5 * 60,
      name: 'Email',
      // ...magicLinkConfig,
      ...otpConfig,
    }),
  ],
  session: { strategy: 'jwt' },
})
