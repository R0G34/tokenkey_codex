import axios, { RawAxiosRequestConfig } from 'axios'
import { createHmac } from 'crypto'

export async function api({
  body = {},
  method,
  path,
}: {
  body?: Record<string, unknown>
  method: string
  path: string
}) {
  const url = `${process.env.NYALA_API_BASE_URL!}${process.env.NYALA_API_BASE_PATH}${path}`

  const data = ['POST', 'PUT', 'PATCH'].includes(method)
    ? new TextEncoder().encode(JSON.stringify(body))
    : undefined

  const contentLength =
    ['POST', 'PUT', 'PATCH'].includes(method) && Object.keys(body).length
      ? new TextEncoder().encode(JSON.stringify(body)).length
      : 0

  const msg = `${contentLength}${method}${process.env.NYALA_API_BASE_PATH}${path.replace('?', '').toLowerCase()}`

  const signature = createHmac('sha256', process.env.NYALA_API_SECRET!)
    .update(msg)
    .digest()
    .toString('base64')

  const headers: Record<string, string> = {
    Authorization: `HMAC ${process.env.NYALA_API_KEY!}:${signature}`,
    'Content-Type': 'application/json',
  }

  if (contentLength) headers['Content-Length'] = contentLength.toString()

  return process.env.FIXIE_URL
    ? proxy(url, { data, headers, method })
    : whitelist(url, { body: data, headers, method })
}

export async function apiWeb({
  body = {},
  method,
  path,
}: {
  body?: Record<string, unknown>
  method: string
  path: string
}) {
  const url = `${process.env.NYALA_WEBSITE_API_BASE_URL!}${process.env.NYALA_WEBSITE_API_BASE_PATH}${path}`

  const data = ['POST', 'PUT', 'PATCH'].includes(method)
    ? JSON.stringify(body)
    : undefined

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.NYALA_API_KEY!,
  }

  return process.env.FIXIE_URL
    ? proxy(url, { data, headers, method })
    : whitelist(url, { body: data, headers, method })
}

async function proxy(
  url: string,
  { data, headers, method }: RawAxiosRequestConfig,
) {
  const fixieUrl = new URL(process.env.FIXIE_URL!)

  const response = await axios(url, {
    data,
    headers,
    method,
    proxy: {
      auth: { password: fixieUrl.password, username: fixieUrl.username },
      host: fixieUrl.hostname,
      port: parseInt(fixieUrl.port, 10),
      protocol: 'http',
    },
  })

  // if (response.status >= 400) {
  //   console.log('❌ proxy', method, url, response)
  //   throw new Error('', { cause: response.data })
  // }

  return response.data
}

async function whitelist(url: string, { body, headers, method }: RequestInit) {
  async function performFetch() {
    const response = await fetch(url, { body, headers, method })
    let data
    try {
      data = await response.json()
    } catch (error) {}
    if (!response.ok) {
      if (data) {
        console.log('❌ whitelist', url, method, response, data)
        throw new Error(data.errorMessageCodes.toString(), { cause: data })
      } else {
        console.log('❌ whitelist', url, method, response)
        throw new Error(response.statusText, { cause: response.status })
      }
    }
    return data
  }

  try {
    return await performFetch()
  } catch (error: any) {
    // If timeout, then whitelist IP + retry the fetch after whitelisting.
    if (error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT') {
      const resp = await fetch(process.env.NYALA_ACCESS_WHITELIST_URL!)
      if (!resp.ok) throw new Error('could not whitelist ip')
      return await performFetch()
    }
    // Re-throw other errors
    throw error
  }
}
