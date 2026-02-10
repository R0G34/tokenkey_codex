import { adminSelectTransactionWithUserById } from '@/dal/admin/select-transaction-with-user-by-id'
import { sendTransactionCompleted } from '@/utils/resend/send-transaction-completed'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  if (
    req.headers.get('x-supabase-signature') !==
    process.env.SUPABASE_WEBHOOK_SECRET
  )
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await req.json()

  if (
    payload.record.status !== 'completed' ||
    payload.old_record.status === 'completed'
  )
    return new Response(null, { status: 204 })

  const transaction = await adminSelectTransactionWithUserById(
    payload.record.id,
  )

  await sendTransactionCompleted(
    payload.record.amount,
    transaction.user.email,
    transaction.user.personalData.forename,
    transaction.user.locale,
    payload.record.reference,
  )

  return NextResponse.json({ status: 'email sent' })
}
