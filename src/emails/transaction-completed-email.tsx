import { currencyFormatter } from '@/utils/currency-formatter'
import {
  Body,
  Container,
  Head,
  Html,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { Button } from './_components/button'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Logo } from './_components/logo'

interface Props {
  heading: string
  greeting: string
  mainText: string
  amount: number
  amountText: string
  referenceText: string
  nextStepsText: string
  step1: string
  step2: string
  step3: string
  ctaText: string
  origin: string
  locale: string
  supportText: string
  footerText: string
  reference: string
  terms: {
    tokenKey: string
    concedus: string
    nyala: string
  }
}

const TransactionCompletedEmail = ({
  heading,
  greeting,
  mainText,
  amount,
  amountText,
  referenceText,
  nextStepsText,
  step1,
  step2,
  step3,
  ctaText,
  origin,
  locale,
  supportText,
  footerText,
  reference,
  terms,
}: Props) => {
  return (
    <Html>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded-lg bg-white p-6 shadow-lg">
            <Logo />

            <Header greeting={greeting} heading={heading} />

            {/* Main Content */}
            <Section className="mt-6">
              <Text className="text-gray-700">{mainText}</Text>
              <Text className="mt-4 text-gray-700">
                {amountText} {currencyFormatter.format(amount)}
              </Text>
              <Text className="text-gray-700">
                {referenceText} {reference}
              </Text>
              <Text className="mt-4 text-gray-700">{nextStepsText}</Text>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                <li>{step1}</li>
                <li>{step2}</li>
                <li>{step3}</li>
              </ul>
            </Section>

            {/* Call to Action */}
            <Section className="mt-8 text-center">
              <Button
                ctaText={ctaText}
                href={`${origin}/${locale}/app/wallet`}
              />
            </Section>

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

export default TransactionCompletedEmail

// Preview props for testing (still included for local testing)
TransactionCompletedEmail.PreviewProps = {
  heading: '¡Tu transacción ha sido completada!',
  greeting: '¡Buenas noticias!',
  mainText:
    'Hemos recibido tu transferencia bancaria y tu transacción ya está completada. Los fondos ya están disponibles en tu cuenta de TokenKey.',
  amountText: 'Cantidad depositada:',
  amount: 150,
  referenceText: 'Referencia:',
  nextStepsText: '¿Qué puedes hacer ahora?',
  step1: 'Explora los proyectos disponibles para invertir.',
  step2: 'Compra tokens y diversifica tu portafolio.',
  step3: 'Consulta tu saldo y movimientos en cualquier momento.',
  ctaText: 'Ir a tu cuenta',
  origin: 'https://www.tokenkey.io',
  locale: 'en',
  supportText: '¿Necesitas ayuda? Contáctanos en',
  footerText: 'Todos los derechos reservados.',
  reference: 'REF789XYZ',
  terms: {
    tokenKey: 'https://www.tokenkey.io/terms-and-conditions',
    concedus: 'https://link.concedus.com/tcta',
    nyala:
      'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
  },
} as Props
