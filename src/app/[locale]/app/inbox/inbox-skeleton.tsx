export function InboxSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[360px_1fr]">
      {/* Message List Skeleton */}
      <div className="space-y-2">
        <nav aria-label="Loading messages" className="w-full">
          <ul className="divide-y rounded-md border">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex gap-3 p-4">
                <div className="mt-1 h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 animate-pulse rounded bg-muted ${i % 3 === 0 ? 'w-40' : i % 3 === 1 ? 'w-32' : 'w-36'}`}
                    />
                    <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div
                      className={`h-3 animate-pulse rounded bg-muted ${i % 2 === 0 ? 'w-3/4' : 'w-5/6'}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Message Detail Skeleton */}
      <div className="min-h-[300px]">
        <div className="h-full rounded-md border">
          <div className="border-b p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
