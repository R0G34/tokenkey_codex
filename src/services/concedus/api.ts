type FetchInit = NonNullable<Parameters<typeof fetch>[1]>

export function api({
  body,
  headers = {},
  method,
  path,
}: FetchInit & { path: string }) {
  return fetch(`${process.env.CONCEDUS_API_BASE_URL!}${path}`, {
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method,
  })
}
