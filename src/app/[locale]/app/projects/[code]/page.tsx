import { selectProjectByCode } from '@/dal/project'
import { selectProjectWithDetailsByCode } from '@/dal/project/queries/select-project-with-details-by-code'
import { verifySession } from '@/dal/session'
import { selectProjectCodes } from '@/dal/ssg/queries/select-project-codes'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import ImageCarousel from './image/image-carousel'
import ImageDialog from './image/image-dialog'
import InvestmentCard from './investment-card/investment-card'
import { ProjectProvider } from './project-context'
import ProjectHeadings from './project-headings'
import ProjectInfo from './project-info'

export async function generateStaticParams() {
  const projects = await selectProjectCodes()
  return routing.locales.flatMap((locale) =>
    projects.map(({ code }) => ({ code, locale })),
  )
}

type Props = {
  params: Promise<{ code: string; locale: Locale }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  const { code } = params

  const project = await selectProjectByCode(code)
  if (!project || project.status === 'Under study') notFound()
  const t = await getTranslations('project')
  return { title: `App - ${t('Project.title')} ${project?.code}` }
}

export default async function ProjectPage(props: Props) {
  await verifySession()

  const params = await props.params

  const { code } = params

  const project = await selectProjectWithDetailsByCode(code)

  if (!project || project.status === 'Under study') notFound()

  return (
    <ProjectProvider>
      <div className="min-h-screen pb-[343px] lg:pb-0">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 overflow-x-hidden lg:col-span-2">
            <ProjectHeadings
              project={project}
              translations={project.translations[0]}
            />
            <ImageCarousel
              projectImages={project.images}
              projectTranslation={project.translations[0]}
            />
            <ProjectInfo
              documents={project.documents}
              optins={project.optins}
              project={project}
              translations={project.translations[0]}
            />
          </div>

          <InvestmentCard
            images={project.images}
            optinSummary={project.optinSummary[0]}
            project={project}
            translations={project.translations[0]}
          />
        </div>

        <ImageDialog images={project.images} />
      </div>
    </ProjectProvider>
  )
}
