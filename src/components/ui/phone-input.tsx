'use client'
import { cn } from '@/utils/tailwind/cn'
import { lookup } from 'country-data-list'
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'
import { forwardRef, useEffect, useState } from 'react'
import { CircleFlag } from 'react-circle-flags'
import { z } from 'zod'

import { getErrorMessage } from '@/utils/error/get-error-message'
import { GlobeIcon } from 'lucide-react'

export const phoneSchema = z.string().refine((value) => {
  try {
    return isValidPhoneNumber(value)
  } catch {
    return false
  }
}, 'Invalid phone number')

export type CountryData = {
  alpha2: string
  alpha3: string
  countryCallingCodes: string[]
  currencies: string[]
  emoji?: string
  ioc: string
  languages: string[]
  name: string
  status: string
}

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCountryChange?: (data: CountryData | undefined) => void
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  defaultCountry?: string
  className?: string
  inline?: boolean
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onCountryChange,
      onChange,
      value,
      placeholder,
      defaultCountry,
      inline = false,
      ...props
    },
    ref,
  ) => {
    const [countryData, setCountryData] = useState<CountryData | undefined>()
    const [displayFlag, setDisplayFlag] = useState<string>('')
    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
      if (defaultCountry) {
        const newCountryData = lookup.countries({
          alpha2: defaultCountry.toLowerCase(),
        })[0]
        setCountryData(newCountryData)
        setDisplayFlag(defaultCountry.toLowerCase())

        if (
          !hasInitialized &&
          newCountryData?.countryCallingCodes?.[0] &&
          !value
        ) {
          const syntheticEvent = {
            target: {
              value: newCountryData.countryCallingCodes[0],
            },
          } as React.ChangeEvent<HTMLInputElement>
          onChange?.(syntheticEvent)
          setHasInitialized(true)
        }
      }
    }, [defaultCountry, onChange, value, hasInitialized])

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Ensure the value starts with "+"
      if (!newValue.startsWith('+')) {
        // Replace "00" at the start with "+" if present
        if (newValue.startsWith('00')) {
          newValue = '+' + newValue.slice(2)
        } else {
          // Otherwise just add "+" at the start
          newValue = '+' + newValue
        }
      }

      try {
        const parsed = parsePhoneNumber(newValue)
        console.log('Phone number details:', {
          isPossible: parsed?.isPossible(),
          isValid: parsed?.isValid(),
          country: parsed?.country,
          nationalNumber: parsed?.nationalNumber,
          formatNational: parsed?.formatNational(),
          formatInternational: parsed?.formatInternational(),
          getType: parsed?.getType(),
          countryCallingCode: parsed?.countryCallingCode,
          getURI: parsed?.getURI(),
          parsed: parsed,
        })

        if (parsed && parsed.country) {
          // Update flag first
          const countryCode = parsed.country
          console.log('Setting flag to:', countryCode.toLowerCase())

          // Force immediate update
          setDisplayFlag('') // Clear first
          setTimeout(() => {
            setDisplayFlag(countryCode.toLowerCase()) // Then set new value
          }, 0)

          // Update other state
          const countryInfo = lookup.countries({ alpha2: countryCode })[0]
          setCountryData(countryInfo)
          onCountryChange?.(countryInfo)

          // Update input value
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: parsed.number,
            },
          } as React.ChangeEvent<HTMLInputElement>
          onChange?.(syntheticEvent)
        } else {
          onChange?.(e)
          setDisplayFlag('')
          setCountryData(undefined)
          onCountryChange?.(undefined)
        }
      } catch (error) {
        const message = getErrorMessage(error)
        console.error('Error parsing phone number:', message)
        onChange?.(e)
        setDisplayFlag('')
        setCountryData(undefined)
        onCountryChange?.(undefined)
      }
    }

    const inputClasses = cn(
      'relative flex h-9 items-center gap-2 rounded-md border border-input bg-transparent pl-3 text-base shadow-xs transition-colors [interpolate-size:allow-keywords] disabled:cursor-not-allowed disabled:opacity-50 has-[input:focus]:ring-1 has-[input:focus]:ring-ring has-[input:focus]:outline-hidden md:text-sm',
      inline && 'w-full rounded-l-none',
      className,
    )

    return (
      <div className={inputClasses}>
        {!inline && (
          <div className="size-4 shrink-0 rounded-full">
            {displayFlag ? (
              <CircleFlag countryCode={displayFlag} height={16} />
            ) : (
              <GlobeIcon size={16} />
            )}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || 'Enter number'}
          type="tel"
          autoComplete="tel"
          name="phone"
          className={cn(
            'flex h-9 w-full border-none bg-transparent p-0 py-1 text-base leading-none outline-hidden transition-colors [interpolate-size:allow-keywords] placeholder:text-muted-foreground md:text-sm',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

PhoneInput.displayName = 'PhoneInput'
