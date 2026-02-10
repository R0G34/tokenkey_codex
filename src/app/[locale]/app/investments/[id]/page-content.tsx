'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckIcon,
  CreditCard,
  Hash,
  Loader2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ORDER_COMPLIANCE_STATUS, ORDER_PAYMENT_STATUS } from '../constants'
import { ComplianceReviewCard } from './compliance-review-card'
import { ContractSigningCard } from './contract-signing-card'
import { RejectionCard } from './rejection-card'
import { ViewContractButton } from './view-contract-button'

type Props = {
  order: Tables<'order'> & { project: Tables<'project'> }
  bankAccounts: Tables<'bank_account'>[]
}

export function InvestmentDetailPageContent({ order, bankAccounts }: Props) {
  const t = useTranslations('investment')

  const amountInEuros = (order.token_quantity * order.token_price) / 100
  const tokenPriceInEuros = order.token_price / 100
  const tokenCount = Math.floor(amountInEuros / tokenPriceInEuros)
  const projectProfitability = order.project.profitability
    ? order.project.profitability / 100
    : 0
  const expectedReturn = (amountInEuros * projectProfitability) / 100

  return (
    <div className="space-y-6">
      <Link href="/app/investments">
        <Button className="mb-4" size="sm" variant="ghost">
          <ArrowLeft className="mr-2 size-4" />
          {t('detail.back')}
        </Button>
      </Link>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detail.summary.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('detail.summary.project')}
                </p>
                <p className="font-medium">{order.project.code}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="mt-1 size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('detail.summary.investmentAmount')}
                </p>
                <p className="font-medium">
                  {currencyFormatter.format(amountInEuros)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="mt-1 size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('detail.summary.tokens')}
                </p>
                <p className="font-medium">
                  {t('detail.summary.tokensCount', { count: tokenCount })}
                </p>
                <p className="text-xs text-muted-foreground">
                  @ {currencyFormatter.format(tokenPriceInEuros)}{' '}
                  {t('detail.summary.perToken')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('detail.summary.created')}
                </p>
                <p className="font-medium">
                  {format(new Date(order.created_at), 'PPP')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('detail.summary.investmentAmount')}
              </span>
              <span className="font-medium">
                {currencyFormatter.format(amountInEuros)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('detail.summary.expectedReturn')}
              </span>
              <span className="font-medium text-green-600">
                +{currencyFormatter.format(expectedReturn)} (
                {projectProfitability}%)
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">
                {t('detail.summary.totalExpectedValue')}
              </span>
              <span className="font-semibold">
                {currencyFormatter.format(amountInEuros + expectedReturn)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!order.compliance_status && <ContractSigningCard order={order} />}

      {order.compliance_status ===
        ORDER_COMPLIANCE_STATUS.CONCEDUS_PENDING_COMPLIANCE_REVIEW && (
        <>
          <ComplianceReviewCard order={order} />
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
        </>
      )}

      {(order.compliance_status ===
        ORDER_COMPLIANCE_STATUS.CONCEDUS_300_REJECTED_AML_SANCTIONS_PEP ||
        order.compliance_status ===
          ORDER_COMPLIANCE_STATUS.CONCEDUS_301_REJECTED_NO_ADEQUACY_FINAL ||
        order.compliance_status ===
          ORDER_COMPLIANCE_STATUS.CONCEDUS_302_REJECTED_PROCESS_DATA_ERROR_FRAUD ||
        order.compliance_status ===
          ORDER_COMPLIANCE_STATUS.CONCEDUS_303_REJECTED_OTHER) && (
        <RejectionCard order={order} />
      )}

      {/* {!order.payment_status && (
        <>
          <PaymentCard order={order} bankAccounts={bankAccounts} />
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
        </>
      )} */}

      {/* Payment Processing */}
      {order.payment_status === ORDER_PAYMENT_STATUS.SECUPAY_PENDING && (
        <>
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="font-semibold">
                  {t('detail.paymentProcessing.title')}
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  {t('detail.paymentProcessing.description')}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
        </>
      )}

      {/* Payment Failed */}
      {/* {order.payment_status === ORDER_PAYMENT_STATUS.SECUPAY_FAILED && (
        <>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-5" />
                {t('detail.paymentFailed.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('detail.paymentFailed.description')}
              </p>
              <PaymentCard order={order} bankAccounts={bankAccounts} isRetry />
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
        </>
      )} */}

      {/* Payment Capture Failed (auto-capture after compliance failed) */}
      {order.payment_status === ORDER_PAYMENT_STATUS.SECUPAY_FAILED && (
        <>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-5" />
                {t('detail.paymentCaptureFailed.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('detail.paymentCaptureFailed.description')}
              </p>
              {/* <PaymentCard
                order={order}
                bankAccounts={bankAccounts}
                isCaptureRetry
              /> */}
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
        </>
      )}

      {/* Payment Received */}
      {order.payment_status === ORDER_PAYMENT_STATUS.SECUPAY_OK && (
        <>
          <div className="flex justify-end">
            <ViewContractButton order={order} />
          </div>
          <Card>
            <CardContent className="py-6">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <CheckIcon className="mx-auto size-12 text-green-600" />
                <p className="mt-2 font-semibold text-green-800">
                  {t('detail.paymentReceived.title')}
                </p>
                <p className="mt-1 text-sm text-green-700">
                  {t('detail.paymentReceived.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
