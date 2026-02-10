import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function FAQ(_: { locale: Locale }) {
  const t = await getTranslations('faq')

  return (
    <Accordion type="single" collapsible className="w-full">
      {(
        t.raw('questions') as { answer: string; id: number; question: string }[]
      ).map(({ answer, id, question }) => (
        <AccordionItem key={id} value={`item-${id}`}>
          <AccordionTrigger className="text-start">
            {id}. {question}
          </AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
