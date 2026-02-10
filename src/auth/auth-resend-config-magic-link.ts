import ProviderResend from 'next-auth/providers/resend'
import { sendMagicLink } from '../utils/resend/send-magic-link'

const sendVerificationRequest = async ({
  identifier,
  provider,
  url,
}: Parameters<
  ReturnType<typeof ProviderResend>['sendVerificationRequest']
>[0]) => {
  const { origin } = new URL(url)
  await sendMagicLink(provider.from!, origin, identifier, url)
}

export const magicLinkConfig = {
  sendVerificationRequest,
}
