import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  BarChart,
  Building,
  Coins,
  CreditCard,
  Lock,
  Search,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
}

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Explora Propiedades',
      description:
        'Navega por nuestra selección cuidadosamente curada de propiedades tokenizadas de alta calidad.',
      icon: <Search className="size-12 text-primary" />,
    },
    {
      title: 'Invierte',
      description:
        'Elige la cantidad que deseas invertir y compra tokens de la propiedad seleccionada de forma segura.',
      icon: <CreditCard className="size-12 text-primary" />,
    },
    {
      title: 'Monitorea tu Inversión',
      description:
        'Sigue el rendimiento de tu inversión en tiempo real a través de nuestro dashboard intuitivo.',
      icon: <BarChart className="size-12 text-primary" />,
    },
  ]

  return (
    <div className="container pt-6">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Cómo Funciona TokenKey
      </h1>

      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Tokenización Inmobiliaria: El Futuro de la Inversión
        </h2>
        <p className="mb-4 text-lg">
          TokenKey utiliza la tecnología blockchain para &quot;tokenizar&quot;
          propiedades inmobiliarias, dividiendo su valor en tokens digitales.
          Cada token representa una fracción de la propiedad, permitiendo a los
          inversores participar en el mercado inmobiliario con inversiones más
          pequeñas y obteniendo una mayor liquidez.
        </p>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={index} className="flex flex-col items-center text-center">
            <CardHeader className="items-center">
              {step.icon}
              <CardTitle className="mt-4 text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">
            Proceso Detallado de Inversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-4 pl-5">
            <li>
              <strong>Registro y Verificación:</strong> Crea tu cuenta y
              completa el proceso de verificación KYC para cumplir con las
              regulaciones.
            </li>
            <li>
              <strong>Fondeo de la Cuenta:</strong> Transfiere fondos a tu
              cuenta TokenKey mediante transferencia bancaria o criptomonedas.
            </li>
            <li>
              <strong>Selección de Propiedades:</strong> Explora nuestro
              marketplace de propiedades tokenizadas y elige las que se ajusten
              a tu estrategia de inversión.
            </li>
            <li>
              <strong>Compra de Tokens:</strong> Adquiere tokens de las
              propiedades seleccionadas, cada uno representando una fracción de
              la propiedad.
            </li>
            <li>
              <strong>Gestión de la Inversión:</strong> Monitorea el rendimiento
              de tus inversiones y recibe dividendos proporcionales a tu
              participación.
            </li>
            <li>
              <strong>Liquidez:</strong> Vende tus tokens en el mercado
              secundario cuando lo desees, sujeto a las condiciones del mercado.
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Lock className="mb-2 size-8 text-primary" />
            <CardTitle>Seguridad y Regulación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              TokenKey opera bajo estrictas regulaciones financieras y de
              seguridad para proteger a nuestros inversores:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Cumplimiento con normativas KYC y AML</li>
              <li>Auditorías regulares de smart contracts</li>
              <li>
                Colaboración con custodios regulados para la gestión de activos
              </li>
              <li>Seguros contra ciberataques y fraudes</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Building className="mb-2 size-8 text-primary" />
            <CardTitle>Selección de Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Nuestro equipo de expertos en bienes raíces selecciona
              cuidadosamente cada propiedad basándose en:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Ubicación prime y potencial de apreciación</li>
              <li>Análisis exhaustivo del mercado local</li>
              <li>Due diligence legal y financiera</li>
              <li>Potencial de generación de ingresos</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <Coins className="mb-2 size-8 text-primary" />
          <CardTitle className="text-2xl">
            Ventajas de Invertir con TokenKey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Para Inversores</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Acceso a inversiones inmobiliarias premium desde pequeñas
                  cantidades
                </li>
                <li>
                  Diversificación del portafolio con activos inmobiliarios
                  tokenizados
                </li>
                <li>
                  Mayor liquidez comparado con inversiones inmobiliarias
                  tradicionales
                </li>
                <li>
                  Transparencia y trazabilidad gracias a la tecnología
                  blockchain
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Para Propietarios</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Acceso a un pool global de inversores</li>
                <li>
                  Liquidez parcial sin necesidad de vender la propiedad completa
                </li>
                <li>Valoración de mercado en tiempo real</li>
                <li>Gestión simplificada de múltiples inversores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          ¿Listo para revolucionar tu estrategia de inversión inmobiliaria?
        </h2>
        <Link href="/projects">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Explora Nuestras Propiedades Tokenizadas{' '}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Preguntas Frecuentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                q: '¿Qué es la tokenización inmobiliaria?',
                a: 'La tokenización inmobiliaria es el proceso de convertir los derechos de propiedad de un activo inmobiliario en tokens digitales en una blockchain, permitiendo la propiedad fraccionada y aumentando la liquidez.',
              },
              {
                q: '¿Cómo se garantiza la seguridad de mi inversión?',
                a: 'Utilizamos tecnología blockchain de última generación, smart contracts auditados, y colaboramos con custodios regulados. Además, cumplimos con todas las regulaciones financieras aplicables.',
              },
              {
                q: '¿Puedo vender mis tokens en cualquier momento?',
                a: 'Sí, los tokens pueden venderse en nuestro mercado secundario, sujeto a las condiciones del mercado y posibles períodos de bloqueo iniciales para ciertas propiedades.',
              },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="mb-2 font-semibold">{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
