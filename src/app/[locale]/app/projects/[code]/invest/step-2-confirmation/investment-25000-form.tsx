'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Investment25000FormSchema = z.object({})

export type Investment25000FormSchemaDataType = z.infer<
  typeof Investment25000FormSchema
>

interface Props {
  isInvesting: boolean
  onClickCancel: () => void
  onFormSubmit: () => void | Promise<void>
}

export default function Investment25000Form({
  isInvesting,
  onClickCancel,
  onFormSubmit,
}: Props) {
  const t = useTranslations('investment.dialog.step2')
  const form = useForm<Investment25000FormSchemaDataType>({
    resolver: zodResolver(Investment25000FormSchema),
  })

  async function onSubmit(_: Investment25000FormSchemaDataType) {
    onFormSubmit()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={onClickCancel}
            type="button"
            variant="outline"
          >
            {t('formCommon.buttons.back')}
          </Button>
          <Button
            className="flex-1"
            disabled={isInvesting}
            type="submit"
            size="lg"
          >
            {isInvesting
              ? t('formCommon.buttons.pending')
              : t('formCommon.buttons.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
