'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { FileText, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { signContract } from './actions'

type Props = {
  order: Tables<'order'>
}

export function ContractSigningCard({ order }: Props) {
  const t = useTranslations('investment')
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignContract = () => {
    setIsSubmitting(true)
    startTransition(async () => {
      const result = await signContract(order.id)
      setIsSubmitting(false)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Contract signed successfully!')
      }
    })
  }

  const isLoading = isPending || isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          {t('detail.contractSigning.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('detail.contractSigning.description')}
        </p>

        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleSignContract}
          size="lg"
        >
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {t('detail.contractSigning.button')}
        </Button>
      </CardContent>
    </Card>
  )
}
