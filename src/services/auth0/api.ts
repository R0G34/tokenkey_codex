import { getAccessToken } from './get-token'

export const api = async (
  endpoint: string,
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST',
  body?: Record<string, unknown>,
) => {
  const token = await getAccessToken()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/${endpoint}`,
    {
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method,
    },
  )

  const data = await response.json()

  if (!response.ok) throw new Error(`Auth0 API Error: ${JSON.stringify(data)}`)

  return data
}
