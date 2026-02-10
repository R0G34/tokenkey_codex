/**
 * Helper: Mask IBAN for display
 * Example: "DE89370400440532013000" -> "DE89 **** **** 3000"
 */
export const formatMaskedIban = (iban: string): string => {
  const cleaned = iban.replace(/\s/g, '')
  if (cleaned.length < 8) return cleaned

  const prefix = cleaned.slice(0, 4)
  const suffix = cleaned.slice(-4)
  return `${prefix} **** **** ${suffix}`
}
