import { Alert, AlertDescription } from '@/components/ui/alert'
import { selectUserWithCompanyAndPersonalDataAndExperience } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-experience'
import { listByBucket } from '@/dal/storage'
import { redirect } from '@/i18n/navigation'
import { getAreAllFilesUploaded } from '@/utils/files'
import { AlertCircle } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { PersonType } from '../../account-type-form-schema'
import { ProfessionalRequirements } from './professional-requirements'
import WphgProfessionalForm from './wphg-professional-form'

export default async function WphgProfessionalPageContent() {
  const [locale, user, files, t] = await Promise.all([
    getLocale(),
    selectUserWithCompanyAndPersonalDataAndExperience(),
    listByBucket('company-documents'),
    getTranslations('onboarding.wphg.professional'),
  ])

  const areAllFilesUploaded = getAreAllFilesUploaded(
    files,
    !!user.personal_data?.roles?.powerOfAttorney,
  )

  if (!user.type || !user.personal_data)
    return redirect({ href: '/app/onboarding', locale })
  if (
    user.type === Number(PersonType.Customer.valueOf()) &&
    (user.personal_data.pep === null || user.personal_data.pep === undefined)
  )
    return redirect({ href: '/app/onboarding/pep', locale })
  if (
    user.type === Number(PersonType.Company.valueOf()) &&
    !areAllFilesUploaded
  )
    return redirect({ href: '/app/onboarding/ubo-aml/documents', locale })

  return (
    <>
      <Alert className="mb-4 border border-amber-100 bg-amber-50">
        <AlertCircle className="size-4 text-amber-800!" />
        {/* @ts-expect-error */}
        <AlertDescription>{t(`p1.${user.type}`)}</AlertDescription>
      </Alert>
      <p className="mb-4 text-sm text-muted-foreground">{t('p2')}</p>
      <WphgProfessionalForm
        initialData={
          user.experience
            ? (user.experience.professional as {
                requirements: ProfessionalRequirements
                consent: boolean
              })
            : null
        }
        name={
          user.type === Number(PersonType.Customer.valueOf())
            ? `${user.personal_data.forename} ${user.personal_data.surname}`
            : user.company!.name
        }
        userType={user.type}
      />
    </>
  )
}
