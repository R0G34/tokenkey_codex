import { Icons } from '@/components/ui/icons'
import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { verifySession } from '@/dal/session'
import { listByBucket } from '@/dal/storage'
import { redirect as i18nRedirect } from '@/i18n/navigation'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { PersonType } from '../account-type-form-schema'
import IFrameContainer from './iframe-container'

export const metadata: Metadata = {
  title: 'Identification',
}

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function IdentificationPage(props: Props) {
  const params = await props.params

  const { locale } = params

  await verifySession()

  const [user, files] = await Promise.all([
    selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet(),
    listByBucket('company-documents'),
  ])

  if (
    !user.personal_data ||
    !user.bank_account ||
    (user.type === Number(PersonType.Company.valueOf()) &&
      (!user.personal_data.roles ||
        !user.company ||
        !user.company.beneficial_owners ||
        !user.company.representatives)) ||
    user.personal_data.pep === null ||
    !user.experience ||
    !user.wallet
  )
    return i18nRedirect({ href: '/app/onboarding', locale })

  const t = await getTranslations('onboarding.kyc')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
          {t('title')}
        </h2>
      </div>
      <p>{t('intro')}</p>
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <p className="">
              Estamos verificando tus datos. Una vez completado, serás
              redirigido al siguiente paso. ¡Espera un momento!
            </p>
            <Icons.spinner className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <IFrameContainer files={files} user={user} />
      </Suspense>
    </div>
  )
}
