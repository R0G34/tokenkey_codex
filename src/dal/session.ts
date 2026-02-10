import 'server-only'

import { auth } from '@/auth/auth'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'
import { cache } from 'react'

// https://nextjs.org/docs/app/building-your-application/caching#react-cache-function
export const verifySession = cache(async () => {
  const session = await auth()

  if (!session) redirect('/api/auth/signin')

  // For secure checks, you can check if the session is valid by comparing the session ID with your database. Use React's cache function to avoid unnecessary duplicate requests to the database during a render pass.

  return session
})
