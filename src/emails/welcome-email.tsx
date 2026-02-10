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
  introText: string
  nextStepsText: string
  step1: string
  step2: string
  step3: string
  ctaText: string
  origin: string
  locale: string
  supportText: string
  footerText: string
  terms: {
    tokenKey: string
    concedus: string
    nyala: string
  }
}

const WelcomeEmail = ({
  heading,
  greeting,
  introText,
  nextStepsText,
  step1,
  step2,
  step3,
  ctaText,
  origin,
  locale,
  supportText,
  footerText,
  terms,
}: Props) => {
  return (
    <Html>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-xl bg-white p-6 shadow-lg">
            <Logo />

            <Header greeting={greeting} heading={heading} />

            {/* Main Content */}
            <Section className="mt-6">
              <Text className="text-gray-700">{introText}</Text>
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
                href={`${origin}/${locale}/app/projects`}
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

export default WelcomeEmail

WelcomeEmail.PreviewProps = {
  heading: '¡Bienvenido a TokenKey!',
  greeting: '¡Estamos emocionados de tenerte a bordo!',
  introText:
    'Gracias por unirse a TokenKey, tu puerta de entrada a inversiones inmobiliarias inteligentes. Ya sea que estes buscando aumentar tu patrimonio o diversificar tu cartera, estamos aquí para guiarte en cada paso del camino.',
  nextStepsText: 'Esto es lo que puedes hacer a continuación:',
  step1: 'Explora los proyectos disponibles en tu panel.',
  step2: 'Diversifica tu portafolio con tokens de activos únicos.',
  step3: 'Comienza a invertir con tan solo 100€.',
  ctaText: 'Ir a tu dashboard',
  origin: 'https://www.tokenkey.io',
  locale: 'en',
  supportText: '¿Necesitas ayuda? Contáctanos en',
  footerText: 'Todos los derechos reservados.',
  terms: {
    tokenKey: 'https://www.tokenkey.io/terms-and-conditions',
    concedus: 'https://link.concedus.com/tcta',
    nyala:
      'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
  },
}
