import { buttonVariants } from '@/components/ui/button'
import { selectProjectsWithDetails } from '@/dal/project/queries/select-projects-with-details'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ProjectCard } from '../app/projects/project-card'

export default async function HighlightedProjects({
  locale,
}: {
  locale: Locale
}) {
  const t = await getTranslations('project')

  const projects = await selectProjectsWithDetails(locale)

  return (
    <ul className="flex flex-wrap justify-evenly gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          images={project.images}
          optinSummary={project.optinSummary[0]}
          project={project}
          translations={project.translations[0]}
        >
          <div className="flex w-full items-center gap-1">
            <Link
              className={cn(
                'w-full',
                buttonVariants({
                  variant: project.status === 'Reserved' ? 'default' : 'ghost',
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

            {/* <Button className="w-full" variant="secondary">
                Invierte
              </Button> */}
          </div>
        </ProjectCard>
      ))}
    </ul>
  )
}
