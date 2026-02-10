import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { TokenKeyMap } from './tokenkey-map'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutUsPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Sobre TokenKey</h1>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            Revolucionando la Inversión Inmobiliaria
          </h2>
          <p className="mb-4 text-lg">
            En TokenKey, estamos a la vanguardia de la revolución en inversiones
            inmobiliarias. Nuestra plataforma combina la solidez del mercado
            inmobiliario tradicional con la innovación de la tecnología
            blockchain, ofreciendo una nueva forma de invertir en propiedades:
            tokenizada, accesible y transparente.
          </p>
          <p className="mb-4 text-lg">
            Fundada en 2024 por un equipo de expertos en tecnología, finanzas e
            inmobiliaria, TokenKey nació con la misión de democratizar el acceso
            a inversiones inmobiliarias de alta calidad, permitiendo a
            inversores de todos los niveles participar en este mercado
            tradicionalmente exclusivo.
          </p>
        </div>
        <div className="relative h-[300px] md:h-full">
          <Image
            // src="/placeholder.svg?height=400&width=600"
            // src="/img/banner.png"
            alt="TokenKey office"
            className="rounded-lg object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src="/img/logo-tokenkey.png"
            // objectFit="cover"
            // objectFit="contain"
          />
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Nuestra Misión y Visión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg">
            <strong>Misión:</strong> Democratizar el acceso a inversiones
            inmobiliarias de calidad a través de la tokenización, permitiendo a
            inversores de todo el mundo participar en el mercado inmobiliario de
            forma segura, transparente y con bajas barreras de entrada.
          </p>
          <p className="text-lg">
            <strong>Visión:</strong> Ser líderes globales en la transformación
            del mercado inmobiliario, creando un ecosistema donde la propiedad
            fraccionada y la liquidez sean la norma, impulsando la innovación y
            la accesibilidad en el sector.
          </p>
        </CardContent>
      </Card>

      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <CardHeader className="items-center">
            <Shield className="mb-2 size-12 text-primary" />
            <CardTitle>Seguridad y Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Operamos bajo estrictas regulaciones, garantizando la seguridad de
              tus inversiones y el cumplimiento de todas las normativas
              aplicables.
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <CardHeader className="items-center">
            <TrendingUp className="mb-2 size-12 text-primary" />
            <CardTitle>Innovación Continua</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Estamos constantemente innovando para ofrecer las mejores
              soluciones de inversión inmobiliaria tokenizada, aprovechando lo
              último en tecnología blockchain.
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <CardHeader className="items-center">
            <Users className="mb-2 size-12 text-primary" />
            <CardTitle>Comunidad Global</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Construimos una comunidad global de inversores, democratizando el
              acceso a oportunidades inmobiliarias de calidad en todo el mundo.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Nuestro Equipo Directivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                role: 'CEO',
                name: 'Ana García',
                bio: 'Ex-directora de una firma líder en PropTech, con más de 15 años de experiencia en el sector inmobiliario.',
              },
              {
                role: 'CTO',
                name: 'Carlos Rodríguez',
                bio: 'Ingeniero de software con amplia experiencia en blockchain y desarrollo de plataformas financieras descentralizadas.',
              },
              {
                role: 'CFO',
                name: 'Laura Martínez',
                bio: 'Experta en finanzas con un historial probado en gestión de inversiones y regulación financiera.',
              },
            ].map((member) => (
              <div key={member.role} className="text-center">
                <Image
                  // src="/placeholder.svg?height=150&width=150"
                  src="https://images.unsplash.com/placeholder-avatars/extra-large.jpg?w=150&dpr=2&crop=faces&bg=%23fff&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt={`${member.name} portrait`}
                  width={150}
                  height={150}
                  className="mx-auto mb-4 rounded-full"
                />
                <h3 className="mb-2 text-lg font-semibold">{member.name}</h3>
                <p className="mb-2 font-medium text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Contacto y Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong>Dirección:</strong> Pl. de Santo Domingo, 28013 Madrid,
                España
              </p>
              <p className="mb-2">
                <strong>Email:</strong> info@tokenkey.com
              </p>
              <p className="mb-2">
                <strong>Teléfono:</strong> +34 xxx xxx xxx
              </p>
              <p className="mb-4">
                <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 -
                18:00
              </p>
              {/* <Link href="#"> */}
              <Button>
                Contáctanos <ArrowRight className="ml-2 size-4" />
              </Button>
              {/* </Link> */}
            </div>
            <div className="relative h-[300px]">
              {/* <Image
                src="/placeholder.svg?height=300&width=400&text=Mapa"
                alt="Mapa de ubicación de TokenKey"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              /> */}
              <TokenKeyMap />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
