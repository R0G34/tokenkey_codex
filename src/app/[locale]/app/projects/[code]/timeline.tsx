import { Card, CardContent } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'

interface Props {
  project: Tables<'project'>
}

export default function Timeline({ project }: Props) {
  const timeline = [
    { date: 'Marzo 2025', event: 'Inicio de captación de fondos' },
    { date: 'Mayo 2025', event: 'Cierre de financiación' },
    { date: 'Junio 2025', event: 'Inicio de obras' },
    { date: 'Enero 2026', event: 'Finalización del proyecto' },
    { date: 'Febrero 2026', event: 'Distribución de beneficios' },
  ]
  return (
    <Card>
      <CardContent>
        <h3 className="mb-4 font-semibold">Cronograma del proyecto</h3>
        {timeline.map((item, index) => (
          <div key={index} className="relative mb-8 flex">
            <div className="mr-4 flex flex-col items-center">
              <div className="z-10 flex size-8 items-center justify-center rounded-full bg-accent text-white">
                {index + 1}
              </div>
              {index < timeline.length - 1 && (
                <div className="absolute top-8 bottom-0 left-4 h-full w-0.5 bg-accent/30" />
              )}
            </div>
            <div className="flex-1 rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-accent">{item.date}</p>
              <p className="mt-1">{item.event}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
