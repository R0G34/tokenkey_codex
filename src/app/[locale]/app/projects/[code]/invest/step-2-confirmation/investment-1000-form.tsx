'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { currencyFormatter } from '@/utils/currency-formatter'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Investment1000FormSchema = z
  .object({
    confirmAsset: z.boolean(),
    confirmMonthlyIncome: z.boolean(),
  })
  .refine((data) => data.confirmAsset || data.confirmMonthlyIncome)

type Investment1000FormSchemaDataType = z.infer<typeof Investment1000FormSchema>

interface Props {
  isInvesting: boolean
  onClickCancel: () => void
  onFormSubmit: () => void | Promise<void>
}

export default function Investment1000Form({
  isInvesting,
  onClickCancel,
  onFormSubmit,
}: Props) {
  const t = useTranslations('investment.dialog.step2')
  const form = useForm<Investment1000FormSchemaDataType>({
    resolver: zodResolver(Investment1000FormSchema),
    defaultValues: {
      confirmAsset: false,
      confirmMonthlyIncome: false,
    },
  })

  async function onSubmit(_: Investment1000FormSchemaDataType) {
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
            <p>{t('form1000.p1')}</p>
            <p>{t('form1000.p2')}</p>
            <FormField
              control={form.control}
              name="confirmAsset"
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
                      <p>
                        {t('form1000.confirmAsset', {
                          amount: currencyFormatter.format(100000),
                        })}
                      </p>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
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
                  </div>
                </FormItem>
              )}
            />

            {!!Object.keys(form.formState.errors).length && (
              <p className="text-destructive">{t('form1000.error')}</p>
            )}
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
