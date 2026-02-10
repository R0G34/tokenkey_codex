'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter as i18nUseRouter, Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { unlinkWallet } from './actions'

interface Props {
  wallet: Tables<'wallet'>
}

export function WalletLinked({ wallet }: Props) {
  const i18nRouter = i18nUseRouter()
  const t = useTranslations('onboarding')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // toast(t('custody.walletLinked.copy.toast.title'), {
    //   description: t('custody.walletLinked.copy.toast.description'),
    // })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUnlinkWallet = async () => {
    try {
      setIsSubmitting(true)
      const { error } = await unlinkWallet()
      if (error) throw Error(error as string)
      toast(t('custody.walletLinked.toast.success'))
      i18nRouter.push('/app/onboarding/custody')
    } catch (error) {
      const message = getErrorMessage(error)
      setIsSubmitting(false)
      toast.error(t('toast.error'), {
        description: message,
      })
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <p className="text-slate-600">
        {/* {t('custody.walletLinked.subtitle')} */}
        {t.rich('custody.walletLinked.intro', {
          link: (chunks) => (
            <a className="underline" href="https://web3auth.io" target="_blank">
              {chunks}
            </a>
          ),
          strong: (chunks) => <strong>{chunks}</strong>,
        })}{' '}
        <Popover>
          <PopoverTrigger className="text-primary underline">
            {t('custody.walletLinked.tooltip.trigger')}
          </PopoverTrigger>
          <PopoverContent className="text-sm whitespace-pre-wrap">
            {t('custody.walletLinked.tooltip.content')}
          </PopoverContent>
        </Popover>
      </p>

      {/* <div className="rounded-lg bg-slate-50 p-4">
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-500">
            {t('custody.walletLinked.addressLabel')}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border bg-white px-4 py-2 font-mono text-sm break-all">
              <span className="hidden sm:block">{wallet.address}</span>
              <span className="sm:hidden">
                {wallet.address.substring(0, 6)}...{wallet.address.slice(-4)}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(wallet.address)}
              className="size-9.5 border-slate-200"
            >
              {copied ? (
                <Check className="size-4 text-primary" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-500">
              {t('custody.walletLinked.connectionDateLabel')}
            </h3>
            <div className="flex items-center gap-2 rounded-md border bg-white px-4 py-3">
              <span className="text-slate-700">
                {format(wallet.created_at, 'PPP')}
              </span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-500">
              {t('custody.walletLinked.walletTypeLabel')}
            </h3>
            <div className="flex items-center gap-2 rounded-md border bg-white px-4 py-3">
              <span className="text-slate-700">
                {wallet.type === 'web3auth'
                  ? t('custody.walletLinked.web3auth')
                  : t('custody.walletLinked.external')}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      <Alert className="mb-4 border border-blue-100 bg-blue-50">
        <Info className="size-4 text-blue-400!" />
        <AlertDescription className="block text-xs text-blue-500 md:text-sm">
          {t('custody.walletLinked.outro')}
        </AlertDescription>
      </Alert>

      {/* {wallet.type === 'web3auth' && (
        <>
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-xl font-semibold">
              <Eye className="size-5 text-green-600" />
              {t('custody.walletLinked.retrievePrivateKey')}
            </p>
          </div>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {toast(t('custody.walletLinked.emailLabel'))}
                  </h4>
                  <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                    <Mail className="size-4 text-primary" />
                    <span className="font-medium break-all">
                      {(wallet.web3auth_user_info as any).email}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {t('custody.walletLinked.loginMethodLabel')}
                  </h4>
                  <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                    <LogIn className="size-4 text-primary" />
                    <span className="font-medium">
                      {(wallet.web3auth_user_info as any).typeOfLogin ===
                      'email_passwordless'
                        ? 'email'
                        : (wallet.web3auth_user_info as any).typeOfLogin}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('custody.walletLinked.privateKey')}
                </h4>
                <Web3AuthPrivateKey wallet={wallet} />
              </div>
            </CardContent>
          </Card>
        </>
      )} */}

      {/* <>
        <div className="space-y-1.5">
          <p className="text-xl font-semibold flex items-center gap-2">
            <Pen className="size-5 text-green-600" />
            Cambio de wallet
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            Para cambiar tu wallet, por favor contáctanos.
          </CardContent>
        </Card>
      </> */}

      <div className="mt-4 flex items-center justify-end gap-1">
        {/* <Button
          disabled={isSubmitting}
          onClick={handleUnlinkWallet}
          variant="outline"
        >
          {t('custody.walletLinked.change')}
          {isSubmitting && <Icons.spinner className="animate-spin" />}
        </Button> */}
        <Link
          className={buttonVariants()}
          href="/app/onboarding/identification"
        >
          {t('custody.walletLinked.accept')}
        </Link>
      </div>
    </div>
  )
}
