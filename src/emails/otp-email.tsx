import {
  Body,
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
    heading: string
    hint: string
    notice: string
    noticeTitle: string
    preview: string
    text: string
  }
  footerText: string
  supportText: string
  token: string
  terms: {
    tokenKey: string
    concedus: string
    nyala: string
  }
}

export const OTPEmail = ({
  email: { heading, hint, notice, noticeTitle, preview, text },
  footerText,
  supportText,
  token,
  terms,
}: Readonly<Props>) => {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded bg-white p-8 shadow-lg">
            <Logo />
            <Header greeting={''} heading={heading} />
            <Text className="mb-[16px] leading-[24px] text-gray-700">
              {text}
            </Text>
            <Section className="text-center">
              <Section className="mx-auto mt-4 mb-3 w-[280px] rounded-[4px] bg-black/5 align-middle text-gray-700">
                {/* font-[HelveticaNeue-Bold] */}
                <Text className="m-auto mt-0 inline-block w-full py-2 text-center font-mono text-[32px] leading-10 font-bold tracking-[6px] text-black">
                  {token}
                </Text>
              </Section>
              <Text className="m-0 mb-6 text-center text-sm text-gray-700">
                {hint}
              </Text>
            </Section>
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

OTPEmail.PreviewProps = {
  email: {
    heading: '🪄 Your verification code',
    hint: 'This code is valid for 5 minutes',
    notice:
      "If you didn't request this email, you can safely ignore it. Someone may have entered your email address by mistake.",
    noticeTitle: 'Security Notice:',
    preview: 'Sign in to your TokenKey account',
    subject: 'Sign in to',
    text: 'For your security, this code allows you to directly access your account on TokenKey. Enter or copy and paste the code into the open window of your browser:',
  },
  footerText: 'All rights reserved.',
  supportText: 'Need help? Contact us at',
  token: '123456',
  terms: {
    tokenKey: 'https://www.tokenkey.io/terms-and-conditions',
    concedus: 'https://link.concedus.com/tcta',
    nyala:
      'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
  },
} as Props
export default OTPEmail
