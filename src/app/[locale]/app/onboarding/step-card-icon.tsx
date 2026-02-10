import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { CheckCircle2, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface StepCardProps {
  isMobile: boolean
  step: {
    id: string
    title: string
    path: string
    description: string
    icon: React.ElementType
    image: string
    status: string
    isActive: boolean
  }
}

export function StepCardIcon({ isMobile, step }: StepCardProps) {
  const Icon = step.icon

  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="size-6 text-green-500" />
      // case 'in-progress':
      //   return <Clock className="size-6 text-amber-500" />
      case 'locked':
        return <Lock className="size-6 text-muted-foreground" />
      default:
        return null
    }
  }

  const t = useTranslations('onboarding')

  // Compact view for completed steps on mobile
  if (isMobile && step.status === 'completed') {
    return (
      <div className="overflow-hidden rounded-lg border border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <CheckCircle2 className="mr-3 size-5 text-green-500" />
            <h3 className="font-medium">{step.title}</h3>
          </div>
          <Link
            className="text-sm font-medium text-primary hover:text-primary/90"
            // @ts-expect-error
            href={step.path}
          >
            {t('steps.edit')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-6 transition-all duration-200',
        step.isActive ? 'bg-card hover:shadow-md' : 'bg-muted/50',
        step.status === 'completed' &&
          'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/10',
      )}
    >
      <div className="absolute top-4 right-4">{getStatusIcon()}</div>

      <div className="mb-4">
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full p-3',
            step.isActive
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
      <p className="mb-6 text-muted-foreground">{step.description}</p>

      <div className="mt-auto">
        {
          step.status === 'completed' ? (
            <Link
              className="flex w-full justify-center rounded-md bg-green-100 px-4 py-2 font-medium text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
              // @ts-expect-error
              href={step.path}
            >
              {t('steps.edit')}
            </Link>
          ) : (
            /* step.isActive ?  */ <Link
              className={cn(
                'flex w-full justify-center',
                buttonVariants({
                  variant:
                    step.status === 'in-progress' ? 'outline' : 'default',
                }),
                step.isActive
                  ? ''
                  : 'pointer-events-none w-full rounded-md bg-muted px-4 py-2 text-muted-foreground',
              )}
              disabled={!step.isActive}
              // @ts-expect-error
              href={step.path}
            >
              {t('steps.start')}
            </Link>
          ) /* : (
          <button
            className="w-full cursor-not-allowed rounded-md bg-muted px-4 py-2 text-muted-foreground"
            disabled
          >
            {t('steps.locked')}
          </button>
        ) */
        }
      </div>
    </div>
  )
}
