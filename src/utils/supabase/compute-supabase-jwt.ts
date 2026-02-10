import { createSecretKey } from 'crypto'
import * as jose from 'jose'

export const computeSupabaseJWT = (userId: string, exp: number) =>
  new jose.SignJWT({ role: 'authenticated' })
    .setAudience('authenticated')
    .setExpirationTime(Math.floor(new Date(exp).getTime() /*  / 1000 */))
    // .setIssuedAt()
    // .setIssuer('TokenKey')
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .sign(createSecretKey(process.env.SUPABASE_JWT_SECRET!, 'utf-8'))
