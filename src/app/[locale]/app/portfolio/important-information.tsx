import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default async function ImportantInformation() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="mr-2 size-5 text-[#e76e50]" />
          Información importante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
          <li>
            Las inversiones están sujetas a riesgos de mercado. Lea atentamente
            todos los documentos relacionados con el plan.
          </li>
          <li>El rendimiento pasado no es indicativo de resultados futuros.</li>
          <li>
            La rentabilidad esperada es una estimación y puede variar según las
            condiciones del mercado.
          </li>
          <li>
            Asegúrese de que todos los pagos se realicen únicamente a través de
            canales oficiales y seguros.
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
