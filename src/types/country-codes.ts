import { Country } from '@/components/ui/country-dropdown'
import { countries } from 'country-data-list'
import { z } from 'zod'

// Extract valid alpha2 codes from the same filtered list as CountryDropdown
const validCountries = countries.all.filter(
  (country: Country) =>
    country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK',
)

const countryCodes = validCountries.map((country) => country.alpha2)

export const alpha2Code = z.enum([
  countryCodes[0],
  ...countryCodes.slice(1),
] as const) // Type-safe enum
