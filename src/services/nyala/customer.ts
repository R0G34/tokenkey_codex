import { Customer, KycData } from '@/lib/nyala/types/customer'
import { CustomerRequest } from '@/lib/nyala/types/customer-request'
import { api } from './api'

const PATH = '/customers'

export async function getCustomer(customerId: string) {
  const result = await api({
    method: 'GET',
    path: `${PATH}/${customerId}`,
  })
  return result.data as Customer
}

export async function createCustomer(
  body: Partial<CustomerRequest>,
  email: string,
) {
  const result = await api({
    body: { ...body, email },
    method: 'POST',
    path: PATH,
  })
  return result.data as Customer['id']
}

export async function updateCustomer(
  body: Partial<CustomerRequest>,
  customerId: string,
  email: string,
) {
  const result = await api({
    body: { ...body, email },
    method: 'PUT',
    path: `${PATH}/${customerId}`,
  })
  return result.data as Customer['id']
}

export async function saveKycData(
  body: Partial<KycData>,
  customerId: Customer['id'],
) {
  const result = await api({
    body,
    method: 'POST',
    path: `${PATH}/${customerId}/kyc`,
  })
  return result.data as boolean
}
