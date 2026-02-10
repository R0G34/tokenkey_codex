'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/utils/tailwind/cn'
import { Dispatch, SetStateAction } from 'react'

export default function SliderWithInput({
  id,
  color,
  label,
  max,
  min,
  setValue,
  step,
  unit,
  value,
}: {
  id: string
  color?: string
  label: string
  max: number
  min: number
  setValue: Dispatch<SetStateAction<number>>
  step: number
  unit: string
  value: number
}) {
  const handleChange = (newValue: number) =>
    setValue(Math.max(min, Math.min(max, newValue)))

  const bgColor = color
    ? {
        'var(--chart-1)': '[&_.bg-primary]:bg-[var(--chart-1)]',
        'var(--chart-5)': '[&_.bg-primary]:bg-[var(--chart-5)]',
        // 'var(--chart-4)': '[&_.bg-primary]:bg-[var(--chart-4)]',
      }[color]
    : ''

  const borderColor = color
    ? {
        'var(--chart-1)': '[&_.border-primary]:border-[var(--chart-1)]',
        'ar(--chart-5)': '[&_.border-primary]:border-[var(--chart-5)]',
        // 'var(--chart-4)': '[&_.border-primary]:border-[var(--chart-4)]',
      }[color]
    : ''

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center space-x-4">
        <Slider
          className={cn(
            'grow',
            '[&>.bg-secondary]:bg-gray-200',
            bgColor,
            borderColor,
          )}
          max={max}
          min={min}
          onValueChange={(newValue) => handleChange(Number(newValue[0]))}
          step={step}
          value={[value]}
        />
        <Input
          className="w-28"
          id={id}
          max={max}
          min={min}
          onChange={(e) => handleChange(Number(e.target.value))}
          step={step}
          type="number"
          value={value}
        />
        <span>{unit}</span>
      </div>
      {/* <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {unit === '€'
            ? currencyFormatter.format(min)
            : `${numberFormatter.format(min)} ${unit}`}
        </span>
        <span>
          {unit === '€'
            ? currencyFormatter.format(max)
            : `${numberFormatter.format(max)} ${unit}`}
        </span>
      </div> */}
    </div>
  )
}
