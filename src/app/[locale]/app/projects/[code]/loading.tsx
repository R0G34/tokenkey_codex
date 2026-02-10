import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectLoading() {
  return (
    <div className="min-h-screen pb-[303px] lg:pb-0">
      <div className="mx-auto grid w-full max-w-7xl gap-6 md:px-4 lg:grid-cols-3">
        <div className="space-y-6 overflow-x-hidden lg:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            {/* Header section */}
            <div>
              <Skeleton className="mb-2 h-10 w-3/4 max-w-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-64" />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6 flex gap-2">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Image carousel section */}
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]">
            {/* Thumbnails */}
            <div className="hidden flex-col gap-2 md:flex">
              <Skeleton className="size-20 rounded-md" />
              <Skeleton className="size-20 rounded-md" />
            </div>

            {/* Main image */}
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          </div>

          {/* Left section - Tabs and content */}
          <div>
            <div className="mb-4 flex gap-4 overflow-x-auto">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 shrink-0" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        </div>

        {/* Info cards */}
        <div className="mt-[88px] hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-[1fr_350px]">
          {/* Right section - Investment details */}
          <div className="space-y-4">
            <div className="space-y-6 rounded-xl border p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-20 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Investment stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <Skeleton className="mb-2 h-4 w-28" />
                <Skeleton className="mb-2 h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* User investment card */}
            <div className="space-y-4 rounded-xl border p-6">
              <Skeleton className="mb-4 h-6 w-32" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
