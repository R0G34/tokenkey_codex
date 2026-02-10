import { cn } from '@/utils/tailwind/cn'
import { PropsWithChildren } from 'react'
// import '/node_modules/flag-icons/css/flag-icons.min.css'
import '../../../../../node_modules/flag-icons/css/flag-icons.min.css'

interface Props extends PropsWithChildren {
  code: string
  square?: boolean
}

export function CountryFlag({ code, square = false }: Props) {
  return <span className={cn('fi', square ? 'fis' : '', `fi-${code}`)} />
  // return (
  //   <span
  //     className={cn(
  //       "bg-contain bg-no-repeat bg-[50%] w-[1.333333em] h-[1em] leading-[1em] relative inline-block before:content-[' ']",
  //       `fi-${code}`,
  //     )}
  //   />
  // )
}
