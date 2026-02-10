import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

export default function AppLoading() {
  return (
    // <div className="space-y-6">
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <Skeleton className="h-8 w-[200px]" />
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}
