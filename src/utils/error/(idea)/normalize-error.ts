import { AppError } from './app-error'

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) return error

  if (error instanceof Error) {
    return new AppError(error.message, error)
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const details = 'code' in error ? { code: error.code } : undefined
    return new AppError(String(error.message), error, details)
  }

  if (typeof error === 'string') {
    return new AppError(error)
  }

  return new AppError('An unexpected error occurred', error, {
    raw: String(error), // Fallback for odd types
  })
}
