import { buttonVariants } from '@/components/ui/button'
import { selectProjectsWithDetails } from '@/dal/project/queries/select-projects-with-details'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ProjectCard } from '../../app/projects/project-card'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata(_: Omit<Props, 'children'>) {
  const t = await getTranslations('project.page')
  return {
    title: t('title'),
    // description: t('description'),
  }
}

export default async function page(props: Props) {
  const params = await props.params

  const { locale } = params

  const projects = await selectProjectsWithDetails(locale)

  const t = await getTranslations('project')

  return (
    <div className="container px-4 pt-6">
      <h1 className="mb-8 text-center text-4xl font-bold">{t('page.title')}</h1>

      <ul className="flex flex-wrap justify-center gap-4">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard
              images={project.images}
              optinSummary={project.optinSummary[0]}
              project={project}
              translations={project.translations[0]}
            >
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
            </ProjectCard>
          </li>
        ))}
      </ul>
    </div>
  )
}
