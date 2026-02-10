import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { listByBucket } from '@/dal/storage'
import { getAreAllFilesUploaded } from '@/utils/files'
import Stepper from './stepper'

export default async function StepperController() {
  const [user, files] = await Promise.all([
    selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet(),
    listByBucket('company-documents'),
  ])

  if (user.type === null) return null

  const areAllFilesUploaded = getAreAllFilesUploaded(
    files,
    !!user.personal_data?.roles?.powerOfAttorney,
  )

  return (
    <>
      {/* Compact step indicators for mobile */}
      <Stepper
        areAllFilesUploaded={areAllFilesUploaded}
        className="mt-8 md:hidden"
        compact={true}
        user={user}
      />

      {/* Desktop Step Indicator */}
      <Stepper
        areAllFilesUploaded={areAllFilesUploaded}
        className="mt-8 hidden md:block"
        user={user}
      />
    </>
  )
}
