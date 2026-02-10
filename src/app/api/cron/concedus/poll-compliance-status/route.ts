import { adminSelectOrdersByStatus } from '@/dal/admin/orders'
import { getComplianceRecordByContractKey } from '@/services/concedus/get-compliance-records'
import { processComplianceRecords } from '@/services/concedus/process-compliance-records'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Cron job endpoint to poll Concedus for compliance status updates
 * Runs hourly as fallback mechanism for missed webhooks
 *
 * Strategy:
 * 1. Fetch all orders with status 'pending_compliance_review'
 * 2. For each order, poll Concedus API for compliance status
 * 3. Process compliance records using same logic as webhook
 *
 * Security:
 * - Requires CRON_SECRET header for authentication
 * - Should be called only by authorized cron services (e.g., Vercel Cron, GitHub Actions)
 *
 * Usage with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/poll-compliance-status",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export const GET = async (req: NextRequest) => {
  try {
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('❌ poll-compliance-status: CRON_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      console.log('❌ poll-compliance-status: Unauthorized request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all orders pending compliance review
    const orders = await adminSelectOrdersByStatus(null)

    console.log(
      `ℹ️ poll-compliance-status: Found ${orders.length} orders pending compliance review`,
    )

    if (orders.length === 0) {
      return NextResponse.json({
        message: 'No orders pending compliance review',
        processed: 0,
      })
    }

    // Poll Concedus for each order
    const complianceRecords = []
    for (const order of orders) {
      const contractKey = `CONTR_${order.id}`

      console.log(
        `ℹ️ poll-compliance-status: Polling Concedus for ${contractKey}`,
      )

      const record = await getComplianceRecordByContractKey(contractKey)

      if (record) {
        complianceRecords.push(record)
      }
    }

    console.log(
      `ℹ️ poll-compliance-status: Found ${complianceRecords.length} compliance records`,
    )

    // Process compliance records using same logic as webhook
    if (complianceRecords.length > 0) {
      await processComplianceRecords(complianceRecords)
    }

    return NextResponse.json({
      message: 'Compliance status polling completed',
      ordersChecked: orders.length,
      recordsProcessed: complianceRecords.length,
    })
  } catch (error) {
    console.error('❌ poll-compliance-status: error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
