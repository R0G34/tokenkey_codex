import { Badge } from '@/components/ui/badge'
import { Tables } from '@/lib/supabase/types/database.types'
import { MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CountryFlag } from '../country-flag'

interface Props {
  project: Tables<'project'>
  translations: Tables<'project_translation'>
}

export default function ProjectHeadings({ project, translations }: Props) {
  const t = useTranslations('project')

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{translations.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          <span>
            {translations.city}, {translations.state}, {translations.country}{' '}
            <CountryFlag code="es" />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="border-primary text-primary">
          {/* @ts-expect-error */}
          {t(`Project.type.${project.type}`)}
        </Badge>
        <Badge variant="outline" className="border-primary text-primary">
          {/* @ts-expect-error */}
          {t(`Project.status.${project.status}`)}
        </Badge>
      </div>
    </div>
  )
}
