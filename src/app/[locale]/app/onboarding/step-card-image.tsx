import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { CheckCircle2, Clock, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface StepCardProps {
  isMobile: boolean
  step: {
    id: string
    title: string
    path: string
    description: string
    image: string
    status: string
    isActive: boolean
  }
}

export function StepCardImage({ isMobile, step }: StepCardProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="size-6 text-green-500" />
      case 'in-progress':
        return <Clock className="size-6 text-amber-500" />
      default:
        return <Lock className="size-6 text-muted-foreground" />
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
        'relative overflow-hidden rounded-lg border transition-all duration-200',
        step.isActive ? 'bg-card hover:shadow-md' : 'bg-muted/50',
        step.status === 'completed' &&
          'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/10',
      )}
    >
      <div className="absolute top-4 right-4 z-10">{getStatusIcon()}</div>

      <div className="relative h-40 w-full">
        {/* <img
          src={step.image || '/placeholder.svg'}
          alt={step.title}
          className={cn(
            'w-full h-full object-cover',
            !step.isActive && 'opacity-60',
          )}
        /> */}
        <Image
          src={step.image || '/placeholder.svg'}
          alt={step.title}
          className={cn(
            'h-full w-full object-cover',
            !step.isActive && 'opacity-60',
          )}
        />
        <div
          className={cn(
            'absolute inset-0',
            !step.isActive && 'bg-background/30',
          )}
        />
      </div>

      <div className="p-5">
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
              /*  step.isActive ? */ <Link
                className={cn(
                  'w-full',
                  buttonVariants({
                    variant:
                      step.status === 'in-progress' ? 'outline' : 'default',
                  }),
                )}
                disabled={!step.isActive}
                // @ts-expect-error
                href={step.path}
              >
                {t('steps.start')}{' '}
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
    </div>
  )
}
