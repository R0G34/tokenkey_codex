export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return `${error.message}. ${error.cause}`
  // if (error instanceof Error) return `${error.message} ${error.cause}`

  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)

  if (typeof error === 'string') return error

  // return 'sth went wrong'
  return JSON.stringify(error) ?? 'sth went wrong'
}
