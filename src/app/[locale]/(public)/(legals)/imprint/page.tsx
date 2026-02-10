import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata(_: Omit<Props, 'children'>) {
  const t = await getTranslations('legals.imprint')
  return { title: t('title') }
}

export default async function ImprintPage(props: Props) {
  const params = await props.params
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'legals.imprint' })

  return (
    <div
      className="container prose pt-6"
      dangerouslySetInnerHTML={{ __html: t.raw('html') }}
    />
  )
}
