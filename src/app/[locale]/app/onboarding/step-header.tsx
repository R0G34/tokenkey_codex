import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  subtitle: string
  title: string
}

export function StepHeader({ icon, subtitle, title }: Props) {
  const Icon = icon

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-lg md:size-14">
        <Icon className="size-6.5 md:size-8" />
      </div>
      <div>
        <h3 className="text-base font-semibold md:text-xl">{title}</h3>
        <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>
      </div>
    </div>
  )
}
