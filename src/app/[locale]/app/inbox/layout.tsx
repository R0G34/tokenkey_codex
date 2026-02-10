import { PropsWithChildren, Suspense } from 'react'
import { InboxDataProvider } from './inbox-data-provider'
import InboxLayoutHeader from './inbox-layout-header'
import { InboxSkeleton } from './inbox-skeleton'

export default function InboxLayout({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto w-full max-w-7xl">
      <InboxLayoutHeader />

      <Suspense fallback={<InboxSkeleton />}>
        <InboxDataProvider>{children}</InboxDataProvider>
      </Suspense>
    </main>
  )
}
