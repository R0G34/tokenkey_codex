import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { FAQ } from './faq'

export const metadata: Metadata = {
  title: 'App - Help',
}

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function HelpPage(props: Props) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations('help')
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <h1 className="text-3xl font-bold">Ayuda y Soporte</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ayuda y soporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                question: '¿Cómo invierto en un proyecto?',
                answer:
                  "Para invertir en un proyecto, dirígete a la página Proyectos, selecciona el proyecto que te interese y haz clic en el botón 'Invertir'. Sigue las instrucciones para completar tu inversión.",
              },
              {
                question:
                  '¿Cuáles son los montos mínimos y máximos de inversión?',
                answer:
                  'El monto mínimo de inversión suele ser de $100, mientras que el máximo puede variar según el proyecto y los tokens disponibles. Consulta los detalles de cada proyecto para conocer los límites específicos.',
              },
              {
                question: '¿Cómo retiro mis fondos?',
                answer:
                  "Para retirar fondos, ve a la página Monedero y haz clic en el botón 'Retirar'. Sigue las instrucciones para completar el proceso de retiro. Ten en cuenta que algunos fondos pueden estar bloqueados en inversiones y no estar disponibles para retiro inmediato.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('faq.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FAQ locale={locale} />
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Contactar con el servicio de asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Input type="text" name="name" id="name" />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input type="email" name="email" id="email" />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Asunto
              </label>
              <Input type="text" name="subject" id="subject" />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Mensaje
              </label>
              <Textarea name="message" id="message" rows={4} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Enviar Mensaje</Button>
            </div>
          </form>
        </CardContent>
      </Card> */}
    </div>
  )
}
