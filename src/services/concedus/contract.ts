import { SendContractPayload } from '@/lib/condedus/types/contract'
import { SendContractResponse } from '@/lib/condedus/types/send-contract-response'
import JSZip from 'jszip'
import { api } from './api'
import { generateSessionToken } from './generate-session-token'

/**
 * Create a ZIP file containing the contract JSON and PDF file
 * Similar to zipBody() in customer.ts but for contracts
 *
 * @param payload - Contract payload with events
 * @param pdfBytes - PDF file as Uint8Array
 * @returns ZIP file as NodeBuffer
 */
export async function zipContractBody(
  payload: SendContractPayload,
  pdfBytes: Uint8Array,
) {
  const zip = new JSZip()
  zip.file('contract.json', JSON.stringify(payload))
  zip.file(payload.contracts[0].events[0].file, pdfBytes)
  return zip.generateAsync({ type: 'nodebuffer' })
}

/**
 * Send contract record to Concedus for compliance tracking
 * https://docs.concedus.com/import-process/send-data-sets/send-contract-record
 */
export async function importContract(
  payload: SendContractPayload,
  pdfBytes: Uint8Array,
): Promise<SendContractResponse> {
  const { accessToken } = await generateSessionToken()

  const zipBuffer = await zipContractBody(payload, pdfBytes)

  const response = await api({
    body: Buffer.from(zipBuffer),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/zip',
    },
    method: 'POST',
    path: '/compliance/contracts',
  })

  const data = await response.json()

  if (!response.ok) {
    console.log('❌ concedus/sendContractRecord', response.status, data)
    throw new Error(data.info || 'Failed to send contract record', {
      cause: data.reason || data,
    })
  }

  return data as SendContractResponse
}
