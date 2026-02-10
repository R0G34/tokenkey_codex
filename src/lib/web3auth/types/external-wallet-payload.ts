export type ExternalWalletPayload = {
  aud: string
  exp: number
  iat: number
  iss: string
  wallets: { address: string; type: string }[]
}
