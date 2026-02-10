import { Card, CardContent } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { Calendar, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  project: Tables<'project'>
}

export default function ProjectHighlights({ project }: Props) {
  const t = useTranslations('project')

  const annualizedReturn = (project.profitability / 100) * (12 / project.term)

  return (
    <Card>
      <CardContent>
        <h3 className="mb-4 font-semibold">
          {t('tabs.description.highlights.title')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('tabs.description.highlights.profitability')}
              </p>
              <p className="font-medium">{annualizedReturn.toFixed(2)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('tabs.description.highlights.term')}
              </p>
              <p className="font-medium">
                {t('Project.termValue', { term: project.term })}
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Building className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Gestión inmobiliaria
                    </p>
                    <p className="font-medium">Profesional</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cartera inmobiliaria
                    </p>
                    <p className="font-medium">Diversificada</p>
                  </div>
                </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
