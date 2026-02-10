'use client'

import { Button } from '@/components/ui/button'
import { Tables } from '@/lib/supabase/types/database.types'
import { FileText } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { getContractUrl } from './actions'

type Props = {
  order: Tables<'order'>
}

export function ViewContractButton({ order }: Props) {
  const t = useTranslations('investment.detail')
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)

  const handleViewContract = async () => {
    setIsLoading(true)
    try {
      const { data: signedUrl, error } = await getContractUrl(order.id, locale)

      if (error) {
        toast.error(error)
        return
      }

      if (signedUrl) {
        // Open contract in new tab
        window.open(signedUrl, '_blank')
      }
    } catch (error) {
      toast.error('Failed to load contract')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full sm:w-auto"
      disabled={isLoading}
      onClick={handleViewContract}
      variant="outline"
    >
      <FileText className="mr-2 size-4" />
      {isLoading ? t('viewingContract') : t('viewContract')}
    </Button>
  )
}
