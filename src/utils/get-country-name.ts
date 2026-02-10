import { Country } from '@/components/ui/country-dropdown'
import { countries } from 'country-data-list'

/**
 * Gets the country translation key from an alpha2 country code
 * Returns the format used by CountryDropdown: "{alpha3}-{alpha2}"
 * Example: "US" -> "USA-US" which translates to "United States"
 *
 * @param alpha2Code - The ISO 3166-1 alpha-2 country code (e.g., "US", "DE")
 * @returns The translation key format or the original code if not found
 */
export function getCountryNameKey(
  alpha2Code: string | null | undefined,
): string {
  if (!alpha2Code) return ''
  const country = countries.all.find(
    (c: Country) => c.alpha2 === alpha2Code.toUpperCase(),
  )
  if (!country) return alpha2Code
  // Return the key pattern used in country dropdown translations
  return `${country.alpha3}-${country.alpha2}`
}
