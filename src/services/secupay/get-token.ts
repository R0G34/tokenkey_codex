import { tokenResponseSchema } from './schema'

/**
 * Secupay OAuth2 Token Management
 *
 * Uses client credentials flow with token caching.
 * Token is cached in memory with a 5-minute buffer before expiry.
 */

let cachedToken: { token: string; expiresAt: number } | null = null

export const getSecupayAccessToken = async (): Promise<string> => {
  // Check cache (with 5-minute buffer before expiry)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const response = await fetch(
    `${process.env.SECUPAY_API_BASE_URL}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SECUPAY_CLIENT_ID!,
        client_secret: process.env.SECUPAY_CLIENT_SECRET!,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Secupay OAuth failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const parsed = tokenResponseSchema.parse(data)

  cachedToken = {
    token: parsed.access_token,
    expiresAt: Date.now() + parsed.expires_in * 1000,
  }

  return cachedToken.token
}

/**
 * Clear the cached token (useful for testing or after errors)
 */
export const clearSecupayTokenCache = () => {
  cachedToken = null
}
