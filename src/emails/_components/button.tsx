import { Button as ReactEmailButton } from '@react-email/components'

interface Props {
  ctaText: string
  href: string
}

export const Button = ({ ctaText, href }: Props) => {
  return (
    <ReactEmailButton
      href={href}
      className="rounded-md bg-[#299d90] px-6 py-3 font-semibold text-white transition hover:bg-[#299d90]"
    >
      {ctaText}
    </ReactEmailButton>
  )
}
