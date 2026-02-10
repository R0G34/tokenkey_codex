import { verifySession } from '@/dal/session'
import { verifyUser } from '@/dal/user'
import { Metadata } from 'next'
import { EmailForm } from './email-form'

export const metadata: Metadata = {
  title: 'App - Email',
}

export default async function SettingsAccountPage() {
  await verifySession()

  const user = await verifyUser()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Email</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user.email ? (
          <div className="my-4 flex w-full flex-col gap-1">
            {/* <p>Nombre de usuario: {user.name}</p> */}
            <p>{user.email}</p>
          </div>
        ) : (
          <EmailForm initialValues={{ email: user.email }} />
        )}
      </div>
    </div>
  )
}
