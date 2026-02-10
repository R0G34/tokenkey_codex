import { selectBankAccounts } from '@/dal/bank-account'
import { selectProjectByCode } from '@/dal/project'
import { selectProjectWithDetailsByCode } from '@/dal/project/queries/select-project-with-details-by-code'
import { verifySession } from '@/dal/session'
import { selectProjectCodes } from '@/dal/ssg/queries/select-project-codes'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { InvestPageContent } from './page-content'

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
  const t = await getTranslations('investment')
  return { title: `App - ${t('dialog.title', { name: project.code })}` }
}

export default async function InvestmentPage(props: Props) {
  await verifySession()

  const params = await props.params
  const { code } = params
  const [project, bankAccounts] = await Promise.all([
    selectProjectWithDetailsByCode(code),
    selectBankAccounts(),
  ])

  if (!project || project.status === 'Under study') notFound()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <InvestPageContent
        project={project}
        translations={project.translations[0]}
        bankAccounts={bankAccounts}
      />
    </div>
  )
}
