'use server'

import { updatePersonalData } from '@/dal/personaldata'
import { KycData } from '@/lib/nyala/types/customer'
import { CustomerRequest } from '@/lib/nyala/types/customer-request'
import { Tables } from '@/lib/supabase/types/database.types'
import {
  createCustomer,
  saveKycData,
  updateCustomer,
} from '@/services/nyala/customer'
import { format } from 'date-fns'

export async function syncCustomer(
  email: Tables<'user'>['email'],
  personalData: Tables<'personal_data'>,
) {
  const {
    forename,
    surname,
    birthdate, //birth_date
    phone_number, // not required
    street_number, // street_no
    postcode,
    country, // country_iso,
    nationality, // nationality_iso // not required
    city,
    gender,
    ...rest
  } = personalData

  const customerRequest = {
    ...rest,
    firstname: forename,
    lastname: surname,
    birthDate: birthdate!,
    phoneNumber: phone_number ?? undefined, // not required
    streetNo: street_number,
    postalCode: postcode,
    town: city,
    countryIso: country,
    nationalityIso: nationality, // not required
    gender: gender ?? undefined,
  } as Partial<CustomerRequest>

  if (personalData.nyala_customer_id)
    return updateCustomer(
      customerRequest,
      personalData.nyala_customer_id,
      email,
    )

  const customerId = await createCustomer(customerRequest, email)

  await updatePersonalData({ nyala_customer_id: customerId })

  const { birthDate, ...rest2 } = customerRequest

  const kycRequest = {
    ...rest2,
    address: {
      street: personalData.street,
      streetNo: personalData.street_number,
      postalCode: personalData.postcode,
      town: personalData.city,
      countryCodeIso2: personalData.country,
    },
    dateOfBirth: format(personalData.birthdate, 'yyyy-MM-dd'),
    email,
    eulaAgreed: true,
    highCorruptionIndex: false,
    identVerified: true,
    identVerifiedType: 'Plain',
    nonPepPerson: true,
    nonSanctionedCountry: true,
    nonUsTaxPerson: true,
    placeOfBirth: 'Australia',
  } as Partial<KycData>

  await saveKycData(kycRequest, customerId)

  return customerId
}
