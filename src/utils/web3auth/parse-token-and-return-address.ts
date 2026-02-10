const publicKeyToAddress = require('ethereum-public-key-to-address')

export const parseTokenAndReturnAddress = (token: string) => {
  if (!token) return null

  const base64Url = token.split('.')[1]

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  )

  return publicKeyToAddress(
    JSON.parse(jsonPayload)?.wallets[0]?.public_key || '',
  )
}
