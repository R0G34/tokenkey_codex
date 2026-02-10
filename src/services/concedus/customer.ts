import { PersonType } from '@/app/[locale]/app/onboarding/account-type-form-schema'
import { download } from '@/dal/storage'
import { Company, ICustomer } from '@/lib/condedus/types/customer'
import { ImportCustomerResponse } from '@/lib/condedus/types/import-customer-response'
import JSZip from 'jszip'
import { api } from './api'
import { generateSessionToken } from './generate-session-token'

export async function zipBody(payload: { customers: Company[] }) {
  const zip = new JSZip()
  zip.file('company.json', JSON.stringify(payload))
  for (const event of payload.customers[0].events) {
    const data = await download('company-documents', event.file)
    const arrayBuffer = await data.arrayBuffer()
    zip.file(event.file, arrayBuffer)
  }
  return zip.generateAsync({ type: 'nodebuffer' })
}

export async function importCustomer(payload: { customers: ICustomer[] }) {
  // ;(payload.customers[0] as Company).person.subPersons[2].person.taxId = 'TEST'
  const { body, contentType } =
    payload.customers[0].person.type === Number(PersonType.Company) &&
    (payload.customers[0] as Company).events.length
      ? {
          body: Buffer.from(await zipBody(payload as { customers: Company[] })),
          contentType: 'application/zip',
        }
      : {
          body: JSON.stringify(payload),
          contentType: 'application/json',
        }

  const { accessToken } = await generateSessionToken()
  const response = await api({
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
    },
    method: 'POST',
    path: '/compliance/contacts',
  })
  const data = await response.json()
  if (!response.ok) {
    console.log(
      '❌ concedus/importCustomer',
      JSON.stringify(payload),
      response,
      data,
    )
    throw new Error(data.info, { cause: data.reason })
  }
  return data as ImportCustomerResponse
}
