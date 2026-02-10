import { ConcedusComplianceRecord } from '@/services/concedus/schema'
import { api } from './api'

/**
 * Response structure from Concedus compliance API
 */
type GetComplianceRecordsResponse = {
  complianceRecords: ConcedusComplianceRecord[]
}

/**
 * Fetch all compliance records from Concedus API
 * Used as fallback mechanism for missed webhooks
 *
 * @returns Array of compliance records
 */
export async function getComplianceRecords(): Promise<
  ConcedusComplianceRecord[]
> {
  try {
    const response = await api({
      path: '/v2/compliance/status',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CONCEDUS_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error(
        `❌ getComplianceRecords: HTTP ${response.status}`,
        await response.text(),
      )
      return []
    }

    const data = (await response.json()) as GetComplianceRecordsResponse

    return data.complianceRecords || []
  } catch (error) {
    console.error('❌ getComplianceRecords: error fetching compliance:', error)
    return []
  }
}

/**
 * Fetch compliance status for a specific contract from Concedus API
 *
 * @param contractKey - The contract key (e.g., "CONTR_123")
 * @returns Compliance record or null if not found
 */
export async function getComplianceRecordByContractKey(
  contractKey: string,
): Promise<ConcedusComplianceRecord | null> {
  try {
    const response = await api({
      path: `/v2/compliance/status/contracts/${contractKey}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CONCEDUS_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log(
          `ℹ️ getComplianceRecordByContractKey: No compliance record found for ${contractKey}`,
        )
        return null
      }

      console.error(
        `❌ getComplianceRecordByContractKey: HTTP ${response.status}`,
        await response.text(),
      )
      return null
    }

    const data = (await response.json()) as ConcedusComplianceRecord

    return data
  } catch (error) {
    console.error(
      `❌ getComplianceRecordByContractKey: error fetching compliance for ${contractKey}:`,
      error,
    )
    return null
  }
}
