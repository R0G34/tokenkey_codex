import 'server-only'

import { render } from '@react-email/components'
import { CreateEmailOptions, Resend } from 'resend'
import { v4 as uuid } from 'uuid'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export const send = async ({
  from,
  react,
  subject,
  text,
  to,
}: {
  from: CreateEmailOptions['from']
  react: React.ReactElement
  subject: CreateEmailOptions['subject']
  text: NonNullable<CreateEmailOptions['text']>
  to: CreateEmailOptions['to']
}) => {
  const data = await resend.emails.send({
    from,
    headers: { 'X-Entity-Ref-ID': uuid() },
    html: await render(react),
    subject,
    // Fallback for email clients that don't render HTML, e.g. feature phones
    text,
    to,
  })

  if (data.error)
    throw new Error('Resend error', { cause: JSON.stringify(data.error) })
}
