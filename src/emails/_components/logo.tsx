import { Img, Section } from '@react-email/components'

export const Logo = () => {
  return (
    <Section className="mb-6 text-center">
      <Img
        src="https://www.tokenkey.io/_next/image?url=%2Fimg%2Flogo-tokenkey.png&w=384&q=75"
        alt="TokenKey Logo"
        className="mx-auto h-12 w-auto"
      />
    </Section>
  )
}
