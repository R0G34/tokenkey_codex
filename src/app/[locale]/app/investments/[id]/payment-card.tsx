'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { AlertCircle, Banknote, CreditCard, Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { initiatePayment, retryCapturePayment, retryPayment } from './actions'
import { formatMaskedIban } from '../../projects/[code]/invest/utils'

interface Props {
  order: Tables<'order'> & { project: Tables<'project'> }
  bankAccounts: Tables<'bank_account'>[]
  isRetry?: boolean
  isCaptureRetry?: boolean
}

export function PaymentCard({
  order,
  bankAccounts,
  isRetry = false,
  isCaptureRetry = false,
}: Props) {
  const t = useTranslations('investment.detail.payment')
  const [isPending, startTransition] = useTransition()

  // Find default bank account or use first one
  const defaultAccount =
    bankAccounts.find((a) => a.is_default) ?? bankAccounts[0]

  // Selected IBAN or 'new' for new account
  const [selectedIban, setSelectedIban] = useState<string | 'new'>(
    defaultAccount?.iban ?? 'new',
  )
  const [newIban, setNewIban] = useState('')
  const [newAccountOwner, setNewAccountOwner] = useState('')

  const amountInEuros = (order.token_quantity * order.token_price) / 100

  const handlePayment = () => {
    // For capture retry, we don't need IBAN - payment is already authorized
    if (isCaptureRetry) {
      startTransition(async () => {
        const result = await retryCapturePayment({ orderId: order.id })

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(t('success'))
        }
      })
      return
    }

    const isNewAccount = selectedIban === 'new'
    const selectedAccount = bankAccounts.find((a) => a.iban === selectedIban)

    const iban = isNewAccount ? newIban : selectedAccount?.iban
    const accountOwner = isNewAccount
      ? newAccountOwner
      : selectedAccount?.holder

    if (!iban || !accountOwner) {
      toast.error(t('errors.missingBankDetails'))
      return
    }

    startTransition(async () => {
      const action = isRetry ? retryPayment : initiatePayment
      const result = await action({
        orderId: order.id,
        iban: iban.replace(/\s/g, ''),
        accountOwner,
        isNewBankAccount: isNewAccount,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('success'))
      }
    })
  }

  // Simplified UI for capture retry - payment already authorized
  if (isCaptureRetry) {
    return (
      <div className="space-y-4">
        {/* Amount Summary */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('amount')}</span>
            <span className="text-xl font-semibold">
              {currencyFormatter.format(amountInEuros)}
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <Button
          className="w-full"
          disabled={isPending}
          onClick={handlePayment}
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('retryCapture')
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="size-5" />
          {isRetry ? t('retryTitle') : t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Summary */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('amount')}</span>
            <span className="text-xl font-semibold">
              {currencyFormatter.format(amountInEuros)}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <Label>{t('selectMethod')}</Label>

          <RadioGroup
            value={selectedIban}
            onValueChange={(v) => setSelectedIban(v as string | 'new')}
          >
            {/* Saved Bank Accounts */}
            {bankAccounts.map((account) => (
              <div
                key={account.iban}
                className="flex items-center space-x-3 rounded-lg border p-4"
              >
                <RadioGroupItem value={account.iban} id={account.iban} />
                <Label
                  htmlFor={account.iban}
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <CreditCard className="size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {formatMaskedIban(account.iban)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {account.holder}
                    </p>
                  </div>
                  {account.is_default && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {t('default')}
                    </span>
                  )}
                </Label>
              </div>
            ))}

            {/* New Bank Account */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="new" id="new" />
                <Label
                  htmlFor="new"
                  className="flex cursor-pointer items-center gap-2 font-medium"
                >
                  <Plus className="size-4" />
                  {t('addNewAccount')}
                </Label>
              </div>

              {selectedIban === 'new' && (
                <div className="mt-4 space-y-4 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="iban">{t('iban')}</Label>
                    <Input
                      id="iban"
                      placeholder="DE89 3704 0044 0532 0130 00"
                      value={newIban}
                      onChange={(e) => setNewIban(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountOwner">{t('accountOwner')}</Label>
                    <Input
                      id="accountOwner"
                      placeholder="Max Mustermann"
                      value={newAccountOwner}
                      onChange={(e) => setNewAccountOwner(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        {/* Info Notice */}
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{t('directDebitInfo')}</p>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full"
          disabled={isPending}
          onClick={handlePayment}
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('payNow')
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
