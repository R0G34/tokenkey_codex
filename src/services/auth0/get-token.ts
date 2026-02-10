export const getAccessToken = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
    {
      body: JSON.stringify({
        audience: `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        client_id: process.env.AUTH0_M2M_CLIENT_ID!,
        client_secret: process.env.AUTH0_M2M_CLIENT_SECRET!,
        grant_type: 'client_credentials',
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    },
  )

  if (!response.ok)
    throw new Error(`Failed to get Auth0 token: ${response.statusText}`)

  const data = await response.json()

  return data.access_token
}
