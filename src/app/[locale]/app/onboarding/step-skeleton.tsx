import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import StepContentSkeleton from './step-content-skeleton'

export default function StepSkeleton() {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <div className="flex flex-row items-center gap-4">
          <div className="rounded-full bg-muted p-2 text-primary">
            <Skeleton className="size-8" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[250px]" />
          </div>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">
        <StepContentSkeleton />
      </CardContent>
    </Card>
  )
}
