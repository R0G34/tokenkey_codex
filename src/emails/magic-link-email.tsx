import {
  Body,
  Button,
  Container,
  Head,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Logo } from './_components/logo'
import { Notice } from './_components/notice'

interface Props {
  email: {
    button: string
    heading: string
    notice: string
    noticeTitle: string
    preview: string
    text: string
    text2: string
  }
  footerText: string
  supportText: string
  url: string
  terms: {
    tokenKey: string
    concedus: string
    nyala: string
  }
}

export const MagicLinkEmail = ({
  email: { button, heading, notice, noticeTitle, preview, text, text2 },
  footerText,
  supportText,
  url,
  terms,
}: Readonly<Props>) => {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded-lg bg-white p-8 shadow-lg">
            <Logo />
            <Header greeting={''} heading={heading} />
            {/* <Text className="mb-[16px] leading-[24px] text-gray-700">
              {greeting}
            </Text> */}
            <Text className="mb-6 text-gray-700">{text}</Text>
            <Section className="text-center">
              <Button
                // className="items-center justify-center whitespace-nowrap rounded-md bg-[#299d90] px-4 py-3 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#299d90]/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                className="box-border rounded-[4px] bg-[#299d90] px-[20px] py-3 text-center font-semibold text-white no-underline"
                href={url}
              >
                {button}
              </Button>
            </Section>
            <Text className="mb-[16px] leading-[24px] text-gray-700">
              {text2}
            </Text>

            <Text className="mb-[24px] rounded-[4px] bg-gray-50 p-[12px] leading-[20px] break-all text-gray-600">
              {url}
            </Text>
            <Notice notice={notice} noticeTitle={noticeTitle} />
            <Footer
              supportText={supportText}
              footerText={footerText}
              terms={terms}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

MagicLinkEmail.PreviewProps = {
  email: {
    button: 'Sign In Securely',
    heading: '🪄 Your magic link',
    notice:
      "If you didn't request this email, you can safely ignore it. Someone may have entered your email address by mistake.",
    noticeTitle: 'Security Notice:',
    preview: 'Sign in to your TokenKey account',
    subject: 'Sign in to',
    text: 'For your security, this link allows you to directly access your account on TokenKey. Click the button below to sign in to your account. This link is valid for 5 minutes:',
    text2: 'Or copy and paste this URL into your browser:',
  },
  footerText: 'All rights reserved.',
  supportText: 'Need help? Contact us at',
  url: 'https://www.tokenkey.io/en/auth/verify-request?email=develop@tokenkey.io&token=1234567890',
  terms: {
    tokenKey: 'https://www.tokenkey.io/terms-and-conditions',
    concedus: 'https://link.concedus.com/tcta',
    nyala:
      'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
  },
} as Props
export default MagicLinkEmail
