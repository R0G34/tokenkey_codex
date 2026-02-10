import { getSecupayAccessToken } from './get-token'
import { secupayApiErrorSchema } from './schema'
import { SecupayError } from './secupay-error'

/**
 * Secupay API Client
 *
 * HTTP client with automatic Bearer token authentication.
 * All requests go through this function to ensure consistent auth handling.
 */

interface SecupayApiOptions<T> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: Record<string, unknown>
}

export const api = async <T>({
  method,
  path,
  body,
}: SecupayApiOptions<T>): Promise<T> => {
  const token = await getSecupayAccessToken()

  const response = await fetch(
    `${process.env.SECUPAY_API_BASE_URL}/api/v2${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    },
  )

  const data = await response.json()

  if (!response.ok) {
    const { data: apiError, error } = secupayApiErrorSchema.safeParse(data)
    if (error)
      throw new SecupayError(
        `Secupay API error: ${response.status} - ${JSON.stringify(data)}`,
        response.status,
      )
    // console.log('❌ secupay api', apiError)
    throw new SecupayError(
      `Secupay API error ${apiError.code}: ${response.status} - ${apiError.error} : ${apiError.error_details}`,
      response.status,
      apiError,
    )
  }

  return data as T
}
