'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Check, LucideIcon } from 'lucide-react'

type Props = {
  index: number
  isClickable: boolean
  isCompact: boolean
  isCompleted: boolean
  isCurrent: boolean
  step: {
    // content: React.ReactNode
    // description: string
    icon: LucideIcon
    id: string
    path: string
    title: string
  }
  stepsLength: number
}

export default function StepIndicator({
  index,
  isClickable,
  isCompact,
  isCompleted,
  isCurrent,
  step,
  stepsLength,
}: Props) {
  const circleSize = isCompact ? 'size-8' : 'size-12'
  const iconSize = isCompact ? 'size-4' : 'size-5'
  return (
    <Link
      className={cn(
        'group relative flex flex-col items-center',
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
      )}
      // @ts-expect-error
      href={isClickable ? step.path : '#'}
      key={step.id}
    >
      {/* Step circle with fixed positioning */}
      <div
        className={isCompact ? 'h-10' : 'h-16'}
        style={{ display: 'flex', alignItems: 'start' }}
      >
        <div
          className={cn(
            'relative z-10 flex items-center justify-center rounded-full transition-all duration-200',
            circleSize,
            isCurrent
              ? 'bg-primary text-primary-foreground ring-2 ring-accent md:ring-4'
              : isCompleted
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted',
          )}
        >
          {isCompleted ? (
            <Check className={isCompact ? 'size-4' : 'size-5'} />
          ) : (
            <div
              className={cn(
                isCurrent ? 'text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              {step.icon && <step.icon className={iconSize} />}
            </div>
          )}
        </div>
      </div>

      {/* Connector line with absolute positioning */}
      {index < stepsLength - 1 && (
        <div
          className={cn(
            'absolute h-[2px] bg-muted',
            isCompact
              ? 'top-4 left-[calc(50%+4px)] w-full'
              : 'top-6 left-[calc(50%+6px)] w-full',
          )}
        >
          <div
            className={cn(
              'absolute top-0 left-0 h-full bg-primary transition-all duration-300',
              isCompleted ? 'w-full' : 'w-0',
            )}
          />
        </div>
      )}

      {/* Step title - only show on desktop or if current step on mobile when compact */}
      {(!isCompact || (isCompact && isCurrent)) && (
        <div
          className={cn(
            'px-1 text-center text-xs font-medium',
            !isCompact && 'flex h-10 items-start justify-center',
            isCurrent ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <span>{step.title}</span>
        </div>
      )}
    </Link>
  )
}
