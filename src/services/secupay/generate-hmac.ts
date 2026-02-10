'server-only'

import { createHmac } from 'crypto'

export const generateHmac = (message: string) =>
  createHmac('sha256', process.env.SECUPAY_WEBHOOK_SECRET!)
    .update(message)
    .digest('hex')
