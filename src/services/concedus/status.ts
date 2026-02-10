import { api } from './api'
import { generateSessionToken } from './generate-session-token'

export const Status = {
  FAILURE: 0, // Failure of the ident (or other then named reason)
  VERIFIED: 100, // Verified
  PENDING: 101, // Pending
  ABORTED: 102, // Aborted
  UPDATE_PENDING: 110, // Update pending. The "Update pending" status is shown if a new ident session was created during an update of customers address or kyc relevant data
} as const

export type Status = (typeof Status)[keyof typeof Status]

export async function getStatusByIdent(identId: string) {
  const { accessToken } = await generateSessionToken()
  const response = await api({
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'GET',
    path: `/status/ident/${identId}`,
  })
  const data = await response.json()
  if (!response.ok) {
    console.log('❌ concedus/getStatusByIdent', { identId }, response, data)
    // throw new Error(data.info, { cause: data.reason })
    return null
  }
  return data.status as Status
}

export async function getStatusByPerson(personId: `PERS_${string}`) {
  const { accessToken } = await generateSessionToken()
  const response = await api({
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'GET',
    path: `/status/person/${personId}`,
  })
  const data = await response.json()
  if (!response.ok) {
    console.log('❌ concedus/getStatusByPerson', { personId }, response, data)
    // throw new Error(data.info, { cause: data.reason })
    return null
  }
  return data.status as Status
}
