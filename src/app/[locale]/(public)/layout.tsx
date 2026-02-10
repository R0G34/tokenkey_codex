import { Locale } from 'next-intl'
import { ReactNode } from 'react'
import { Footer } from './footer'
import Header from './header'

type Props = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function WithNavbarLayout(props: Readonly<Props>) {
  const { locale } = await props.params
  const { children } = props

  return (
    <>
      <Header locale={locale} />
      {/* bg-muted/40 p-4 md:p-10 */}
      <div className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 pb-6">
        {children}
      </div>
      <Footer />
    </>
  )
}
