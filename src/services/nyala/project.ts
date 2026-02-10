import { Optin } from '@/lib/nyala/types/optin'
import { Project } from '@/lib/nyala/types/project'
import { Transfer } from '@/lib/nyala/types/transfer'
import { apiWeb } from './api'

/**
 * With this you can retrieve the Customer data as well as Tokenized Asset data together with the Optin & Transfer Status.
 */

const PATH = '/project'

/**
 *
 * For your use cases you can for example check if there is an existing Optin with statuses (10, 12 or 13)
 * KycClaimAdded=8
 * IdentityDeployed=9
 * IdentityRegistered=10
 * IdentityRemoved=11
 * TransferInitiated=12
 * TransferCompleted=13
 * TokenPaused=14
 */
export async function getOptins({ projectId }: { projectId: Project['id'] }) {
  const result = await apiWeb({
    method: 'GET',
    path: `${PATH}/${projectId}/optins`,
  })
  return result.data as Optin[]
}

/**
 * Or you can also check if there is a transfer with status 5
 * New=0
 * Pending=1
 * Rejected=2
 * Approved=3
 * Sent=4
 * Successful=5
 * Failed=6
 * TimedOut=7
 * FailedOnBlockchain=8
 * RecipientAddressNotFound=9
 * RecipientInvalidOptinSatus=10
 */
export async function getTransfers({
  projectId,
}: {
  projectId: Project['id']
}) {
  const result = await apiWeb({
    method: 'GET',
    path: `${PATH}/${projectId}/transfers`,
  })
  return result.data as Transfer[]
}
