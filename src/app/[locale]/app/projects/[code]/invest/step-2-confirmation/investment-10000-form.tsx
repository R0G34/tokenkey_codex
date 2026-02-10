'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  isInvesting: boolean
  onClickCancel: () => void
  onFormSubmit: () => void | Promise<void>
}

export default function Investment10000Form({
  isInvesting,
  onClickCancel,
  onFormSubmit,
}: Props) {
  const t = useTranslations('investment.dialog.step2')
  const Investment10000FormSchema = z.object({
    confirmMonthlyIncome: z.literal(true, {
      errorMap: () => ({
        message: t('form10000.error'),
      }),
    }),
  })
  const form = useForm<z.infer<typeof Investment10000FormSchema>>({
    resolver: zodResolver(Investment10000FormSchema),
    defaultValues: {
      // confirmMonthlyIncome: false,
    },
  })

  async function onSubmit(_: z.infer<typeof Investment10000FormSchema>) {
    onFormSubmit()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Card>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>{t('form10000.p1')}</p>
            <FormField
              control={form.control}
              name="confirmMonthlyIncome"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start justify-between gap-1 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex flex-col gap-0.5">
                    <FormLabel className="text-base font-normal!">
                      {t('formCommon.confirmMonthlyIncome')}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
