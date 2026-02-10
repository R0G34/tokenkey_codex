import ProviderResend from 'next-auth/providers/resend'
import { sendOTP } from '../utils/resend/send-otp'

// https://github.com/nextauthjs/next-auth/issues/709#issuecomment-784077142

// from /next-auth/node_modules/@auth/core/src/lib/utils/web.ts
function randomString(size: number) {
  const i2hex = (i: number) => ('0' + i.toString(16)).slice(-2)
  const r = (a: string, i: number): string => a + i2hex(i)
  const bytes = crypto.getRandomValues(new Uint8Array(size / 2))
  return Array.from(bytes).reduce(r, '')
}

const generateVerificationToken = () => {
  return randomString(8)
}

const sendVerificationRequest = async ({
  identifier,
  provider,
  token,
  url,
}: Parameters<
  ReturnType<typeof ProviderResend>['sendVerificationRequest']
>[0]) => {
  const { origin } = new URL(url)
  await sendOTP(provider.from!, origin, identifier, token)
}

export const otpConfig = {
  generateVerificationToken,
  sendVerificationRequest,
}
