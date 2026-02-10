import { type DefaultSession } from 'next-auth'
import { Locale } from 'next-intl'

declare module 'next-auth/jwt' {
  interface JWT {
    onboardingCompleted: boolean
    locale: Locale
  }
}

declare module 'next-auth' {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken: string
    onboardingCompleted: boolean
    locale: Locale
    user: DefaultSession['user'] & {
      // The user's postal address
      address: string
      id: string
    }
  }
}
