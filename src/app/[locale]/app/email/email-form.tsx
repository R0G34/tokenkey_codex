'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { getErrorMessage } from '@/utils/error/get-error-message'
import { toast } from 'sonner'
import { saveEmail } from './actions'
import { EmailFormSchema, EmailFormSchemaDataType } from './email-form-schema'

interface Props {
  initialValues: { email: string | null }
}

export function EmailForm({ initialValues }: Props) {
  const form = useForm<EmailFormSchemaDataType>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: initialValues?.email ?? '',
    },
  })

  async function onSubmit(data: EmailFormSchemaDataType) {
    try {
      const { data: updatedUser, error } = await saveEmail(data)
      if (error) throw Error(JSON.stringify(error))
      form.reset({ email: updatedUser.email })
      toast('Datos guardados exitosamente')
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error('Uh oh! Something went wrong.', {
        description: message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="m@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
