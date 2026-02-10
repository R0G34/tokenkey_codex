'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { AlertCircle, Banknote, CreditCard, Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { InvestmentSummary } from '../investment-summary'
import { formatMaskedIban } from '../utils'
import { createOrder } from './actions'

interface Props {
  investmentAmountWatched: number
  project: Tables<'project'>
  bankAccounts: Tables<'bank_account'>[]
  setInvestmentStep: Dispatch<SetStateAction<number>>
}

export function InvestmentStep3({
  investmentAmountWatched,
  project,
  bankAccounts,
  setInvestmentStep,
}: Props) {
  const t = useTranslations('investment')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const projectTokenPrice = project.token_price / 100
  const projectProfitability = project.profitability / 100
  const newExpectedReturn =
    (investmentAmountWatched * projectProfitability) / 100
  const newTokens = investmentAmountWatched / projectTokenPrice

  // Find default bank account or use first one
  const defaultAccount =
    bankAccounts.find((a) => a.is_default) ?? bankAccounts[0]

  // Selected IBAN or 'new' for new account
  const [selectedIban, setSelectedIban] = useState<string | 'new'>(
    defaultAccount?.iban ?? 'new',
  )
  const [newIban, setNewIban] = useState('')
  const [newAccountOwner, setNewAccountOwner] = useState('')

  const handleAuthorizeAndInvest = () => {
    const isNewAccount = selectedIban === 'new'
    const selectedAccount = bankAccounts.find((a) => a.iban === selectedIban)

    const iban = isNewAccount ? newIban : selectedAccount?.iban
    const accountOwner = isNewAccount
      ? newAccountOwner
      : selectedAccount?.holder

    if (!iban || !accountOwner) {
      toast.error(t('dialog.step3.errors.missingBankDetails'))
      return
    }

    startTransition(async () => {
      const result = await createOrder({
        projectId: project.id,
        quantity: investmentAmountWatched / projectTokenPrice,
        iban: iban.replace(/\s/g, ''),
        accountOwner,
        isNewBankAccount: isNewAccount,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('dialog.step3.success'))
        router.push({
          pathname: '/app/investments/[id]',
          params: { id: result.data! },
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <InvestmentSummary
        newExpectedReturn={newExpectedReturn}
        newInvestment={investmentAmountWatched}
        newTokens={newTokens}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="size-5" />
            {t('dialog.step3.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('dialog.step3.amount')}
              </span>
              <span className="text-xl font-semibold">
                {currencyFormatter.format(investmentAmountWatched)}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>{t('dialog.step3.selectMethod')}</Label>

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
                        {t('dialog.step3.default')}
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
                    {t('dialog.step3.addNewAccount')}
                  </Label>
                </div>

                {selectedIban === 'new' && (
                  <div className="mt-4 space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="iban">{t('dialog.step3.iban')}</Label>
                      <Input
                        id="iban"
                        placeholder="DE89 3704 0044 0532 0130 00"
                        value={newIban}
                        onChange={(e) => setNewIban(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountOwner">
                        {t('dialog.step3.accountOwner')}
                      </Label>
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
            <p>{t('dialog.step3.directDebitInfo')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => setInvestmentStep(2)}
              type="button"
              variant="outline"
              disabled={isPending}
            >
              {t('dialog.step2.formCommon.buttons.back')}
            </Button>
            <Button
              className="flex-1"
              disabled={isPending}
              onClick={handleAuthorizeAndInvest}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t('dialog.step3.authorizing')}
                </>
              ) : (
                t('dialog.step3.authorizeAndInvest')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
