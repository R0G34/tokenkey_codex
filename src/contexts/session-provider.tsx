'use client'

import { Session } from 'next-auth'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProvider({
  initialSession,
  children,
}: Readonly<{
  initialSession: Session | null
  children: React.ReactNode
}>) {
  return (
    <NextAuthSessionProvider
      refetchOnWindowFocus={true}
      session={initialSession}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
