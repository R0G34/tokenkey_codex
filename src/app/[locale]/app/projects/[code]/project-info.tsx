import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tables } from '@/lib/supabase/types/database.types'
import { useTranslations } from 'next-intl'
import ProjectHighlights from './project-highlights'
import { ProjectMap } from './project-map'
import { Documents } from './tabs/documents/documents'
import RecentSales from './tabs/recent-sales'

interface Props {
  documents: Tables<'project_document'>[]
  optins: Tables<'optin'>[]
  project: Tables<'project'>
  translations: Tables<'project_translation'>
}

export default function ProjectInfo({
  documents,
  optins,
  project,
  translations,
}: Props) {
  const t = useTranslations('project')
  // const t = await getTranslations('project')
  // console.log('🔥', t('tabs'))

  const annualizedReturn = project.profitability * (12 / project.term)

  return (
    <div>
      {/* <ProjectHeadings project={project} translations={translations} /> */}

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="scrollbar-hide w-full justify-start overflow-x-auto">
          <TabsTrigger value="description">
            {t('tabs.description.title')}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {t('tabs.documents.title')}
          </TabsTrigger>
          {/* <TabsTrigger value="legals">{t('tabs.legals.title')}</TabsTrigger> */}
          <TabsTrigger value="activity">
            {t('tabs.recent_activity.title')}
          </TabsTrigger>
          {/* <TabsTrigger value="timeline">{t('tabs.schedule.title')}</TabsTrigger> */}
        </TabsList>
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="mb-4 font-semibold">
                {t('tabs.description.title')}
              </h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: translations.description }}
              />
            </CardContent>
          </Card>
          <ProjectHighlights project={project} />
          <Card>
            <CardContent>
              <h3 className="mb-4 font-semibold">
                {t('tabs.description.location')}
              </h3>
              <div className="space-y-4">
                <ProjectMap project={project} translations={translations} />
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: translations.location_description,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Documents documents={documents} />
        </TabsContent>
        {/* <TabsContent value="legals" className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="mb-4 font-semibold">Marco Legal</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  El proyecto Edificio 17 viviendas cumple con todas las
                  normativas y regulaciones vigentes en materia de construcción
                  y desarrollo inmobiliario en España. Nuestra plataforma de
                  tokenización inmobiliaria opera bajo la supervisión de la
                  Comisión Nacional del Mercado de Valores (CNMV), garantizando
                  la seguridad y transparencia de todas las transacciones.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Scale className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Marco regulatorio
                    </p>
                    <p className="font-medium">CNMV</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="mb-4 font-semibold">Protección del Inversor</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nuestro modelo de tokenización inmobiliaria está diseñado para
                  proteger los intereses de los inversores. Cada token
                  representa una participación real en el proyecto, respaldada
                  por contratos legalmente vinculantes y registrada en
                  blockchain para mayor seguridad y transparencia.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Shield className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Protección del inversor
                    </p>
                    <p className="font-medium">
                      Contratos inteligentes y blockchain
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="activity">
          <RecentSales optins={optins} project={project} />
        </TabsContent>
        {/* <TabsContent value="timeline">
          <Timeline project={project} />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
