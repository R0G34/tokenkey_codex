import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mx-auto w-full max-w-7xl">
        <Skeleton className="h-9 w-64" />
      </div>

      {/* Project cards grid */}
      <ul className="flex flex-wrap justify-center gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border bg-background"
          >
            {/* Card image */}
            {/* <Skeleton className="w-full aspect-[4/3]" /> */}
            <Skeleton className="h-48 w-full" />

            {/* Tags */}
            {/* <div className="absolute top-4 left-4 flex gap-2">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div> */}

            {/* Card content */}
            <div className="space-y-4 p-4">
              {/* Project title */}
              <Skeleton className="h-7 w-3/4" />

              {/* Location */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="ml-auto h-6 w-6" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="flex flex-col items-center">
                  <Skeleton className="mb-1 h-6 w-6 rounded-full" />
                  <Skeleton className="mb-1 h-6 w-20" />
                  <Skeleton className="h-4 w-24 text-center" />
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton className="mb-1 h-6 w-6 rounded-full" />
                  <Skeleton className="mb-1 h-6 w-16" />
                  <Skeleton className="h-4 w-24 text-center" />
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton className="mb-1 h-6 w-6 rounded-full" />
                  <Skeleton className="mb-1 h-6 w-24" />
                  <Skeleton className="h-4 w-24 text-center" />
                </div>
              </div>

              {/* Progress bar */}
              <Skeleton className="h-2 w-full" />

              {/* Investors and tokens */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>

              {/* Action button */}
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}
