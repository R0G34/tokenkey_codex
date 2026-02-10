export type SocialLoginPayload = {
  aggregateVerifier: string
  aud: string
  email: string
  exp: number
  iat: number
  iss: string
  name: string
  profileImage: string
  verifier: string
  verifierId: string
  wallets: { curve: string; public_key: string; type: string }[]
}
