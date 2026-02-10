import { createPrivateKey } from 'crypto'
import * as jose from 'jose'

/**
 * https://web3auth.io/docs/auth-provider-setup/byo-jwt-provider
 * Generate a JWT.
 * @returns
 */
export const generateJWT = async (email: string) => {
  const privateKey = createPrivateKey(process.env.WEB3AUTH_CUSTOM_PRIVATE_KEY!)
  return new jose.SignJWT({ email })
    .setAudience(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!)
    .setExpirationTime('5m')
    .setIssuedAt()
    .setIssuer('TokenKey')
    .setProtectedHeader({ alg: 'RS256', kid: process.env.WEB3AUTH_CUSTOM_KID })
    .sign(privateKey)
}

/**
 * Verifying a JWT using Remote JWK Set.
 * @param jwt
 */
export const verifyJWTUsingJWKSet = async (jwt: string) => {
  const JWKS = jose.createRemoteJWKSet(
    new URL(process.env.WEB3AUTH_CUSTOM_JWKS_ENDPOINT!),
  )
  return jose.jwtVerify(jwt, JWKS, {
    issuer: 'TokenKey',
    audience: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
  })
}
