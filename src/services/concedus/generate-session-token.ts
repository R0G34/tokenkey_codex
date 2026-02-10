import { api } from './api'

export async function generateSessionToken() {
  const response = await api({
    body: JSON.stringify({
      userName: process.env.CONCEDUS_API_USERNAME!,
      password: process.env.CONCEDUS_API_PASSWORD!,
    }),
    method: 'POST',
    path: '/auth/token',
  })
  const data = await response.json()
  if (!response.ok) {
    console.log('❌ concedus/generateSessionToken', response, data)
    throw new Error(data.errorMessageCodes.toString(), { cause: data })
  }
  return data
}
