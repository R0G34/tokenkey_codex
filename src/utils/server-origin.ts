import 'server-only'

// https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL
export const origin =
  process.env.VERCEL_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : 'http://localhost:3000'
