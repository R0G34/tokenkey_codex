import {
  concedusToInternalMap,
  secupayToInternalMap,
} from '@/app/[locale]/app/investments/constants'
import { adminUpdateOrder } from '@/dal/admin/orders'
import { adminUpdatePersonalData } from '@/dal/admin/personaldata'
import { adminSelectSecupayTransactionByOrderId } from '@/dal/admin/secupay-smart-transaction'
import { ConcedusComplianceRecord } from '@/services/concedus/schema'
import { captureSepaDirectDebit } from '@/services/secupay/smart-transaction'
import { CONCEDUS_COMPLIANCE_STATUS } from './concedus-compliance-status'
import { Status } from './status'

export async function processComplianceRecords(
  records: ConcedusComplianceRecord[],
) {
  for (const record of records) {
    if (record.contractKey) {
      if (!record.contractKey.startsWith('CONTR_'))
        throw new Error(`Invalid contractKey format: ${record.contractKey}`)

      const orderId = parseInt(record.contractKey.replace('CONTR_', ''), 10)

      if (isNaN(orderId))
        throw new Error(`Invalid contractKey format: ${record.contractKey}`)

      await adminUpdateOrder(orderId, {
        compliance_status: concedusToInternalMap[record.status],
      })

      // If compliance approved (status 100), auto-capture preauthorized payment
      if (
        record.status === CONCEDUS_COMPLIANCE_STATUS._100_RELEASE_UNCOMPROMISING
      ) {
        const transaction =
          await adminSelectSecupayTransactionByOrderId(orderId)
        if (!transaction) throw new Error(`Order not found ${orderId}`)
        const startResponse = await captureSepaDirectDebit(transaction.id)
        await adminUpdateOrder(orderId, {
          payment_status: secupayToInternalMap[startResponse.status],
        })
      }
    }

    if (record.customerKey) {
      if (!record.customerKey.startsWith('CUSTO_'))
        throw new Error(`Invalid customerKey format: ${record.customerKey}`)

      const userId = record.customerKey.replace('CUSTO_', '')

      if (!userId)
        throw new Error(`Invalid customerKey format: ${record.customerKey}`)

      const kycVerified = record.status === Status.VERIFIED

      await adminUpdatePersonalData(userId, { kyc: kycVerified })
    }
  }
}
