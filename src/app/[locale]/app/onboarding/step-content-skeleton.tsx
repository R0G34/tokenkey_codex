import { Skeleton } from '@/components/ui/skeleton'

export default function StepContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Form Header */}
      {/* <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div> */}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Field Group 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Field Group 2 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 max-w-[200px] flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Skeleton className="h-10 w-full max-w-[200px]" />
        </div>
      </div>
    </div>
  )
}
