import { normalizeError } from './normalize-error'

// Developer/debug info
export const getDebugErrorInfo = (error: unknown): string => {
  const normalized = normalizeError(error)
  const parts = [normalized.message]
  if (normalized.cause) parts.push(`Cause: ${String(normalized.cause)}`)
  if (normalized.details)
    parts.push(`Details: ${JSON.stringify(normalized.details)}`)
  if (normalized.stack) parts.push(`Stack: ${normalized.stack}`)
  return parts.join('\n')
}
