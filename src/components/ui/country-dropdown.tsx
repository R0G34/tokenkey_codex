'use client'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// utils
import { cn } from '@/utils/tailwind/cn'

// assets
import { CheckIcon, ChevronDown, Globe } from 'lucide-react'
import { CircleFlag } from 'react-circle-flags'

// data
import { countries } from 'country-data-list'
import { useTranslations } from 'next-intl'

// Country interface
export interface Country {
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

// Dropdown props
interface CountryDropdownProps {
  options?: Country[]
  onChange?: (country: Country) => void
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  slim?: boolean
}

const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country: Country) =>
        country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK',
    ),
    onChange,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined,
  )

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = options.find(
        (country) => country.alpha2 === defaultValue,
      )
      if (initialCountry) {
        setSelectedCountry(initialCountry)
      } else {
        // Reset selected country if defaultValue is not found
        setSelectedCountry(undefined)
      }
    } else {
      // Reset selected country if defaultValue is undefined or null
      setSelectedCountry(undefined)
    }
  }, [defaultValue, options])

  const handleSelect = useCallback(
    (country: Country) => {
      // console.log('🌍 CountryDropdown value: ', country)
      setSelectedCountry(country)
      onChange?.(country)
      setOpen(false)
    },
    [onChange],
  )

  const triggerClasses = cn(
    'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs ring-offset-background placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    slim === true && 'w-20',
  )

  const t = useTranslations('country')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountry ? (
          <div className="flex w-0 grow items-center gap-2 overflow-hidden">
            <div className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <CircleFlag
                countryCode={selectedCountry.alpha2.toLowerCase()}
                height={20}
              />
            </div>
            {slim === false && (
              <span className="truncate">
                {/* @ts-expect-error */}
                {t(`${selectedCountry.alpha3}-${selectedCountry.alpha2}`)}
              </span>
            )}
          </div>
        ) : (
          <span>
            {slim === false ? (
              t('placeholder') || setSelectedCountry.name
            ) : (
              <Globe size={20} />
            )}
          </span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-(--radix-popper-anchor-width) p-0"
      >
        <Command className="max-h-[200px] w-full sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder={t('placeholderSearch')} />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className="flex w-full items-center gap-2"
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex w-0 grow space-x-2 overflow-hidden">
                      <div className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={option.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span className="truncate">
                        {/* @ts-expect-error */}
                        {t(`${option.alpha3}-${option.alpha2}`)}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4 shrink-0',
                        option.name === selectedCountry?.name
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

CountryDropdownComponent.displayName = 'CountryDropdownComponent'

export const CountryDropdown = forwardRef(CountryDropdownComponent)
