import { normalizeError } from './normalize-error'

// User-facing message
export const getUserErrorMessage = (error: unknown): string => {
  const normalized = normalizeError(error)
  return normalized.message // Simple, clean
}
