import { buttonVariants } from '@/components/ui/button'
import { selectPersonalData } from '@/dal/personaldata'
import { selectProjectsWithDetails } from '@/dal/project/queries/select-projects-with-details'
import { verifySession } from '@/dal/session'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ProjectCard } from './project-card'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata(_: Omit<Props, 'children'>) {
  const t = await getTranslations('project.page')
  return {
    title: `App – ${t('title')}`,
    description: t('description'),
  }
}

export default async function page(props: Props) {
  const params = await props.params

  const { locale } = params

  await verifySession()

  const t = await getTranslations('project')

  const [projects, personalData] = await Promise.all([
    selectProjectsWithDetails(locale),
    selectPersonalData(),
  ])

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-lg font-semibold">{t('page.title')}</h1>
      </div>
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            optins={project.optins}
            project={project}
          >
            <Button className="w-full">Invest Now</Button>
          </ProjectCard>
        ))}
      </div> */}
      <ul className="flex flex-wrap justify-center gap-4">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard
              images={project.images}
              optinSummary={project.optinSummary[0]}
              project={project}
              translations={project.translations[0]}
            >
              {project.status === 'Reserved' ? (
                personalData ? (
                  <Link
                    className={cn('w-full', buttonVariants())}
                    href={{
                      pathname: '/app/projects/[code]',
                      params: { code: project.code.toLowerCase() },
                    }}
                  >
                    {t('page.cta')}
                  </Link>
                ) : (
                  <Link
                    className={cn(
                      'w-full',
                      buttonVariants({ variant: 'secondary' }),
                    )}
                    href="/app/personal-data"
                  >
                    {t('page.requires_kyc')}
                  </Link>
                )
              ) : (
                <Link
                  className={cn(
                    'w-full',
                    buttonVariants({
                      variant:
                        project.status === 'Reserved' ? 'default' : 'ghost',
                    }),
                    project.status === 'Reserved' ? '' : 'pointer-events-none',
                  )}
                  href={{
                    pathname: '/app/projects/[code]',
                    params: { code: project.code.toLowerCase() },
                  }}
                >
                  {project.status === 'Reserved'
                    ? t('page.cta')
                    : // @ts-expect-error
                      t(`Project.status.${project.status}`)}
                </Link>
              )}
            </ProjectCard>
          </li>
        ))}
      </ul>
    </div>
  )
}
