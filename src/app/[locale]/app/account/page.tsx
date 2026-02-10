import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet } from '@/dal/onboarding/queries/select-user-with-company-and-personaldata-and-bank-account-and-experience-and-wallet'
import { verifySession } from '@/dal/session'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getCountryNameKey } from '@/utils/get-country-name'
import { cn } from '@/utils/tailwind/cn'
import { format } from 'date-fns'
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  Pencil,
} from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'App - Account Settings',
}

export default async function AccountPage() {
  await verifySession()

  const [user, t, tCountry, tOnboarding, tProfessional] = await Promise.all([
    selectUserWithCompanyAndPersonalDataAndBankAccountAndExperienceAndWallet(),
    getTranslations('account'),
    getTranslations('country'),
    getTranslations('onboarding.wphg.knowledge.form'),
    getTranslations('onboarding.wphg.professional.form'),
  ])

  // Find the default bank account (or first one if none marked as default)
  const bankAccounts = (user.bank_account ?? []) as Tables<'bank_account'>[]
  const defaultBankAccount =
    bankAccounts.find((a) => a.is_default) ?? bankAccounts[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* 1. Account Overview (no edit button) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('accountOverview.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('accountOverview.email')}
                </p>
                <p className="text-base">{user.email}</p>
              </div>
            </div>
            {user.created_at && (
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accountOverview.memberSince')}
                  </p>
                  <p className="text-base">
                    {format(new Date(user.created_at), 'PPP')}
                  </p>
                </div>
              </div>
            )}
            {user.type != null && (
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accountOverview.userType')}
                  </p>
                  <p className="text-base">
                    {user.type === 0
                      ? t('accountOverview.userTypeCustomer')
                      : t('accountOverview.userTypeCompany')}
                  </p>
                </div>
              </div>
            )}
            {/* KYC Status */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('personalInfo.kycStatus')}
              </p>
              <div className="mt-1">
                {user.personal_data?.kyc ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="size-3" />
                    {t('personalInfo.kycVerified')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="size-3" />
                    {t('personalInfo.kycPending')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t('personalInfo.title')}</CardTitle>
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'pointer-events-none',
            )}
            href="/app/account/edit-details"
          >
            <Pencil className="mr-2 size-4" />
            {t('editButton')}
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {user.personal_data?.salutation && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.salutation')}
                  </p>
                  <p className="text-base">{user.personal_data.salutation}</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {user.personal_data?.forename && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.firstName')}
                  </p>
                  <p className="text-base">{user.personal_data.forename}</p>
                </div>
              )}
              {user.personal_data?.surname && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.lastName')}
                  </p>
                  <p className="text-base">{user.personal_data.surname}</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {user.personal_data?.birthdate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.birthDate')}
                  </p>
                  <p className="text-base">
                    {format(new Date(user.personal_data.birthdate), 'PPP')}
                  </p>
                </div>
              )}
              {user.personal_data?.birthplace && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.placeOfBirth')}
                  </p>
                  <p className="text-base">{user.personal_data.birthplace}</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {user.personal_data?.nationality && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.nationality')}
                  </p>
                  <p className="text-base">
                    {tCountry(
                      // @ts-expect-error
                      getCountryNameKey(user.personal_data.nationality),
                    )}
                  </p>
                </div>
              )}
              {user.personal_data?.gender != null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.gender')}
                  </p>
                  <p className="text-base">
                    {user.personal_data.gender === 0
                      ? t('personalInfo.genderFemale')
                      : user.personal_data.gender === 1
                        ? t('personalInfo.genderMale')
                        : t('personalInfo.genderOther')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {user.personal_data?.phone_number && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.phoneNumber')}
                  </p>
                  <p className="text-base">{user.personal_data.phone_number}</p>
                </div>
              )}
              {user.personal_data?.pep != null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('personalInfo.pepStatus')}
                  </p>
                  <p className="text-base">
                    {user.personal_data.pep
                      ? t('personalInfo.isPep')
                      : t('personalInfo.notPep')}
                  </p>
                </div>
              )}
            </div>

            {/* Address section */}
            <div className="pt-4">
              <p className="mb-3 text-sm font-semibold">{t('address.title')}</p>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {user.personal_data?.street && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('address.street')}
                      </p>
                      <p className="text-base">{user.personal_data.street}</p>
                    </div>
                  )}
                  {user.personal_data?.street_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('address.streetNumber')}
                      </p>
                      <p className="text-base">
                        {user.personal_data.street_number}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.personal_data?.postcode && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('address.postcode')}
                      </p>
                      <p className="text-base">{user.personal_data.postcode}</p>
                    </div>
                  )}
                  {user.personal_data?.city && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('address.city')}
                      </p>
                      <p className="text-base">{user.personal_data.city}</p>
                    </div>
                  )}
                </div>
                {user.personal_data?.country && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('address.country')}
                    </p>
                    <p className="text-base">
                      {tCountry(
                        // @ts-expect-error
                        getCountryNameKey(user.personal_data.country),
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Your role within the company section */}
            {user.personal_data?.roles &&
              typeof user.personal_data.roles === 'object' &&
              user.personal_data.roles !== null && (
                <div className="pt-4">
                  <p className="mb-3 text-sm font-semibold">
                    {t('companyRoles.rolesTitle')}
                  </p>
                  <div className="space-y-2">
                    {(user.personal_data.roles as any).representative && (
                      <div className="rounded-md border p-3">
                        <p className="font-medium">
                          {t('companyRoles.representative')}
                        </p>
                        {typeof (user.personal_data.roles as any)
                          .representative === 'object' &&
                          (user.personal_data.roles as any).representative
                            .fictitiousBeneficialOwner && (
                            <p className="text-sm text-muted-foreground">
                              • {t('companyRoles.fictitiousBeneficialOwner')}
                            </p>
                          )}
                      </div>
                    )}
                    {(user.personal_data.roles as any)
                      .authorizedBeneficialOwner && (
                      <div className="rounded-md border p-3">
                        <p className="font-medium">
                          {t('companyRoles.authorizedBeneficialOwner')}
                        </p>
                        {typeof (user.personal_data.roles as any)
                          .authorizedBeneficialOwner === 'object' && (
                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <p>
                              • {t('companyRoles.capitalShares')}:{' '}
                              {
                                (user.personal_data.roles as any)
                                  .authorizedBeneficialOwner.capitalShares
                              }
                              %
                            </p>
                            <p>
                              • {t('companyRoles.votingRights')}:{' '}
                              {
                                (user.personal_data.roles as any)
                                  .authorizedBeneficialOwner.votingRights
                              }
                              %
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {(user.personal_data.roles as any).powerOfAttorney && (
                      <div className="rounded-md border p-3">
                        <p className="font-medium">
                          {t('companyRoles.powerOfAttorney')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Company Information (if user has a company) */}
      {user.company && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t('companyInfo.title')}</CardTitle>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'pointer-events-none',
              )}
              href="/app/account/edit-company"
            >
              <Pencil className="mr-2 size-4" />
              {t('editButton')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('companyInfo.name')}
                  </p>
                  <p className="text-base">{user.company.name}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {user.company.legal_form && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.legalForm')}
                    </p>
                    <p className="text-base">{user.company.legal_form}</p>
                  </div>
                )}
                {user.company.founding_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.foundingDate')}
                    </p>
                    <p className="text-base">
                      {format(new Date(user.company.founding_date), 'PPP')}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {user.company.registry_number && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.registryNumber')}
                    </p>
                    <p className="text-base">{user.company.registry_number}</p>
                  </div>
                )}
                {user.company.registry_no && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.registryNo')}
                    </p>
                    <p className="text-base">{user.company.registry_no}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {user.company.registry_court && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.registryCourt')}
                    </p>
                    <p className="text-base">{user.company.registry_court}</p>
                  </div>
                )}
                {user.company.tax_id && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('companyInfo.taxId')}
                    </p>
                    <p className="text-base">{user.company.tax_id}</p>
                  </div>
                )}
              </div>

              {/* Company Address section */}
              <div className="pt-4">
                <p className="mb-3 text-sm font-semibold">
                  {t('address.title')}
                </p>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {user.company.street && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('address.street')}
                        </p>
                        <p className="text-base">{user.company.street}</p>
                      </div>
                    )}
                    {user.company.street_number && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('address.streetNumber')}
                        </p>
                        <p className="text-base">
                          {user.company.street_number}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {user.company.postcode && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('address.postcode')}
                        </p>
                        <p className="text-base">{user.company.postcode}</p>
                      </div>
                    )}
                    {user.company.city && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('address.city')}
                        </p>
                        <p className="text-base">{user.company.city}</p>
                      </div>
                    )}
                  </div>
                  {user.company.country && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('address.country')}
                      </p>
                      <p className="text-base">
                        {tCountry(
                          // @ts-expect-error
                          getCountryNameKey(user.company.country),
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Bank Account */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            {t('bankInfo.title')}
          </CardTitle>
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'pointer-events-none',
            )}
            href={'/app/account/bank-accounts' as '/app/account'}
          >
            <Pencil className="mr-2 size-4" />
            {t('editButton')}
          </Link>
        </CardHeader>
        <CardContent>
          {defaultBankAccount ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {defaultBankAccount.holder && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('bankInfo.holder')}
                    </p>
                    <p className="text-base">{defaultBankAccount.holder}</p>
                  </div>
                )}
                {defaultBankAccount.bank && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('bankInfo.bank')}
                    </p>
                    <p className="text-base">{defaultBankAccount.bank}</p>
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {defaultBankAccount.iban && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('bankInfo.iban')}
                    </p>
                    <p className="text-base">{defaultBankAccount.iban}</p>
                  </div>
                )}
                {defaultBankAccount.swift && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('bankInfo.swift')}
                    </p>
                    <p className="text-base">{defaultBankAccount.swift}</p>
                  </div>
                )}
              </div>
              {bankAccounts.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  {t('bankInfo.otherAccounts', {
                    count: bankAccounts.length - 1,
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('bankInfo.noAccount')}</p>
          )}
        </CardContent>
      </Card>

      {/* 5. UBO & AML */}
      {user.company && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t('uboAml.title')}</CardTitle>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'pointer-events-none',
              )}
              href="/app/account/edit-ubo-aml"
            >
              <Pencil className="mr-2 size-4" />
              {t('editButton')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {t('uboAml.description')}
              </p>

              {/* Representatives subsection */}
              {user.company.representatives &&
                Array.isArray(user.company.representatives) &&
                user.company.representatives.length > 0 && (
                  <div className="pt-4">
                    <p className="mb-3 text-sm font-semibold">
                      {t('representatives.title')}
                    </p>
                    <div className="space-y-2">
                      {user.company.representatives.map(
                        (rep: any, index: number) => (
                          <div
                            key={rep.key || index}
                            className="rounded-md border p-3"
                          >
                            {rep.type === 0 ? (
                              <>
                                <p className="text-xs text-muted-foreground">
                                  {t('companyInfo.naturalPerson')}
                                </p>
                                <p className="font-medium">
                                  {rep.forename} {rep.surname}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-muted-foreground">
                                  {t('companyInfo.legalPerson')}
                                </p>
                                <p className="font-medium">{rep.name}</p>
                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                  <p>
                                    • {t('companyInfo.legalForm')}:{' '}
                                    {rep.legalForm}
                                  </p>
                                  <p>
                                    • {t('address.street')}: {rep.street}{' '}
                                    {rep.streetNumber}
                                  </p>
                                  <p>
                                    • {t('address.city')}: {rep.postcode}{' '}
                                    {rep.city}
                                  </p>
                                  <p>
                                    • {t('address.country')}:{' '}
                                    {tCountry(
                                      // @ts-expect-error
                                      getCountryNameKey(rep.country),
                                    )}
                                  </p>
                                  {rep.registryNumber && (
                                    <p>
                                      • {t('companyInfo.registryNumber')}:{' '}
                                      {rep.registryNumber}
                                    </p>
                                  )}
                                  {rep.registryNo && (
                                    <p>
                                      • {t('companyInfo.registryNo')}:{' '}
                                      {rep.registryNo}
                                    </p>
                                  )}
                                  {rep.courtOfRegistration && (
                                    <p>
                                      • {t('companyInfo.registryCourt')}:{' '}
                                      {rep.courtOfRegistration}
                                    </p>
                                  )}
                                  <p>
                                    • {t('companyInfo.taxId')}: {rep.taxId}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Beneficial Owners subsection */}
              {user.company.beneficial_owners &&
                Array.isArray(user.company.beneficial_owners) &&
                user.company.beneficial_owners.length > 0 && (
                  <div className="pt-4">
                    <p className="mb-3 text-sm font-semibold">
                      {t('beneficialOwners.title')}
                    </p>
                    <div className="space-y-2">
                      {user.company.beneficial_owners.map(
                        (owner: any, index: number) => (
                          <div
                            key={owner.id || index}
                            className="rounded-md border p-3"
                          >
                            <p className="font-medium">
                              {owner.forename} {owner.surname}
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <p>
                                • {t('personalInfo.birthDate')}:{' '}
                                {format(new Date(owner.birthdate), 'PPP')}
                              </p>
                              <p>
                                • {t('personalInfo.birthplace')}:{' '}
                                {owner.birthplace}
                              </p>
                              <p>
                                • {t('personalInfo.nationality')}:{' '}
                                {tCountry(
                                  // @ts-expect-error
                                  getCountryNameKey(owner.nationality),
                                )}
                              </p>
                              <p>
                                • {t('address.street')}: {owner.streetAndNumber}
                              </p>
                              <p>
                                • {t('address.city')}: {owner.postcode}{' '}
                                {owner.city}
                              </p>
                              <p>
                                • {t('address.country')}:{' '}
                                {tCountry(
                                  // @ts-expect-error
                                  getCountryNameKey(owner.country),
                                )}
                              </p>
                              <p>
                                • {t('companyRoles.capitalShares')}:{' '}
                                {owner.capitalShares}%
                              </p>
                              <p>
                                • {t('companyRoles.votingRights')}:{' '}
                                {owner.votingRights}%
                              </p>
                              {owner.isPep && <p>• {t('companyInfo.isPep')}</p>}
                              {owner.isFictitiousUbo && (
                                <p>• {t('companyInfo.isFictitiousUbo')}</p>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Investment Experience */}
      {user.experience && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t('experience.title')}</CardTitle>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'pointer-events-none',
              )}
              href="/app/account/edit-experience"
            >
              <Pencil className="mr-2 size-4" />
              {t('editButton')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {user.experience.score != null && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('experience.score')}
                    </p>
                    <p className="mt-1 text-base">{user.experience.score}</p>
                  </div>
                )}
                {user.experience.risk_consent != null && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('experience.riskConsent')}
                    </p>
                    <p className="mt-1 text-base">
                      {user.experience.risk_consent
                        ? t('experience.yes')
                        : t('experience.no')}
                    </p>
                  </div>
                )}
              </div>

              {/* Knowledge Assessment Details */}
              {user.experience.knowledge && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('experience.knowledge')}
                  </p>
                  <div className="rounded-md border p-3">
                    <Badge variant="default" className="mb-2 gap-1">
                      <CheckCircle2 className="size-3" />
                      {t('experience.completed')}
                    </Badge>

                    {/* Questions and Answers */}
                    {user.experience.knowledge.answers && (
                      <div className="mt-3 space-y-3">
                        <p className="text-sm font-semibold">
                          {t('experience.answers')}:
                        </p>
                        {Object.entries(user.experience.knowledge.answers).map(
                          ([questionId, answerId]) => {
                            const questions = tOnboarding.raw(
                              'questions',
                            ) as any[]
                            const question = questions?.find(
                              (q: any) => q.id.toString() === questionId,
                            )
                            const answer = question?.answers?.find(
                              (a: any) => a.id.toString() === answerId,
                            )

                            return (
                              <div
                                key={questionId}
                                className="rounded-md bg-muted/50 p-2"
                              >
                                <p className="text-sm font-medium">
                                  {question?.text || `Question ${questionId}`}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  → {answer?.text || `Answer ${answerId}`}
                                </p>
                              </div>
                            )
                          },
                        )}
                      </div>
                    )}

                    {/* Experience Types */}
                    {user.experience.knowledge.experiences &&
                      Array.isArray(user.experience.knowledge.experiences) &&
                      user.experience.knowledge.experiences.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-semibold">
                            {t('experience.investmentExperience')}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.experience.knowledge.experiences.map(
                              (expId: string) => {
                                const experienceTypes = tOnboarding.raw(
                                  'experience.answers',
                                ) as any[]
                                const expType = experienceTypes?.find(
                                  (e: any) => e.id.toString() === expId,
                                )

                                return (
                                  <Badge key={expId} variant="secondary">
                                    {expType?.text || `Experience ${expId}`}
                                  </Badge>
                                )
                              },
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Professional Investor Details */}
              {user.experience.professional && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('experience.professional')}
                  </p>
                  <div className="rounded-md border p-3">
                    <Badge variant="default" className="mb-2 gap-1">
                      <CheckCircle2 className="size-3" />
                      {t('experience.completed')}
                    </Badge>
                    {user.experience.professional.consent != null && (
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="font-semibold">
                          • {t('experience.consent')}:{' '}
                          {user.experience.professional.consent
                            ? t('experience.yes')
                            : t('experience.no')}
                        </p>
                      </div>
                    )}
                    {user.experience.professional.requirements && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold">
                          {t('experience.requirementsMet')}:
                        </p>
                        <div className="space-y-2">
                          {(() => {
                            const requirements = tProfessional.raw(
                              'requirements',
                            ) as any[]
                            const reqs =
                              user.experience.professional.requirements
                            const userType = user.type || 0

                            return (
                              <>
                                {reqs.assets &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'assets' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'assets' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                                {reqs.experience &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'experience' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'experience' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                                {reqs.transactions &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'transactions' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'transactions' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                                {reqs.balance &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'balance' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'balance' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                                {reqs.equity &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'equity' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'equity' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                                {reqs.revenue &&
                                  requirements?.find(
                                    (r: any) =>
                                      r.title === 'revenue' &&
                                      r.personType === userType,
                                  ) && (
                                    <div className="rounded-md bg-muted/50 p-2">
                                      <p className="text-sm">
                                        {
                                          requirements.find(
                                            (r: any) =>
                                              r.title === 'revenue' &&
                                              r.personType === userType,
                                          )?.text
                                        }
                                      </p>
                                    </div>
                                  )}
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Consent field if it exists at root level */}
              {user.experience.consent && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('experience.consent')}
                    </p>
                    <p className="mt-1 text-base">{user.experience.consent}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
