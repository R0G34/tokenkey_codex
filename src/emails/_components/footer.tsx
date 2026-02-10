import { Hr, Section, Text } from '@react-email/components'

interface Props {
  supportText: string
  footerText: string
  terms: {
    tokenKey: string
    concedus: string
    nyala: string
  }
}

export const Footer = ({ supportText, footerText, terms }: Props) => {
  return (
    <>
      <Hr className="my-6 border-gray-300" />
      <Section className="text-center">
        <Text className="text-sm text-gray-500">
          {supportText}{' '}
          <a
            href={`mailto:info@tokenkey.io`}
            className="text-blue-600 hover:underline"
          >
            info@tokenkey.io
          </a>
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          © {new Date().getFullYear()} TokenKey. {footerText}
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          <a
            href={terms.tokenKey}
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            T&C TokenKey
          </a>
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          <a
            href={terms.concedus}
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            T&C Concedus
          </a>
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          <a
            href={terms.nyala}
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            T&C Nyala
          </a>
        </Text>
      </Section>
    </>
  )
}
