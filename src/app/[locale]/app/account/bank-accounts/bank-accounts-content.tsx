'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tables } from '@/lib/supabase/types/database.types'
import { Check, CreditCard, Loader2, Plus, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { addBankAccount, setDefaultBankAccount } from './actions'

interface Props {
  bankAccounts: Tables<'bank_account'>[]
}

/**
 * Helper: Mask IBAN for display
 * Example: "DE89370400440532013000" -> "DE89 3704 0044 0532 0130 00"
 */
const formatIban = (iban: string): string => {
  const cleaned = iban.replace(/\s/g, '')
  return cleaned.replace(/(.{4})/g, '$1 ').trim()
}

export function BankAccountsContent({ bankAccounts }: Props) {
  const t = useTranslations('account.bankAccounts')
  const [isPending, startTransition] = useTransition()
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state for new account
  const [newIban, setNewIban] = useState('')
  const [newHolder, setNewHolder] = useState('')
  const [newBank, setNewBank] = useState('')
  const [newSwift, setNewSwift] = useState('')
  const [setAsDefault, setSetAsDefault] = useState(false)

  const handleSetDefault = (iban: string) => {
    setPendingAction(`default-${iban}`)
    startTransition(async () => {
      const result = await setDefaultBankAccount(iban)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('defaultSuccess'))
      }
      setPendingAction(null)
    })
  }

  // const handleDelete = (iban: string) => {
  //   setPendingAction(`delete-${iban}`)
  //   startTransition(async () => {
  //     const result = await deleteBankAccount(iban)
  //     if (result.error) {
  //       toast.error(result.error)
  //     } else {
  //       toast.success(t('deleteSuccess'))
  //     }
  //     setPendingAction(null)
  //   })
  // }

  const handleAddAccount = () => {
    if (!newIban || !newHolder) {
      toast.error(t('form.errors.required'))
      return
    }

    setPendingAction('add')
    startTransition(async () => {
      const result = await addBankAccount({
        iban: newIban.replace(/\s/g, ''),
        holder: newHolder,
        bank: newBank || '',
        swift: newSwift || '',
        currency: 'EUR',
        location: '',
        verification_amount: 0,
        is_default: setAsDefault,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('addSuccess'))
        setIsDialogOpen(false)
        // Reset form
        setNewIban('')
        setNewHolder('')
        setNewBank('')
        setNewSwift('')
        setSetAsDefault(false)
      }
      setPendingAction(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Bank Accounts List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t('listTitle')}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 size-4" />
                {t('addAccount')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('form.title')}</DialogTitle>
                <DialogDescription>{t('form.description')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="iban">{t('form.iban')} *</Label>
                  <Input
                    id="iban"
                    placeholder="DE89 3704 0044 0532 0130 00"
                    value={newIban}
                    onChange={(e) => setNewIban(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holder">{t('form.holder')} *</Label>
                  <Input
                    id="holder"
                    placeholder="Max Mustermann"
                    value={newHolder}
                    onChange={(e) => setNewHolder(e.target.value)}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="bank">{t('form.bank')}</Label>
                  <Input
                    id="bank"
                    placeholder="Deutsche Bank"
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swift">{t('form.swift')}</Label>
                  <Input
                    id="swift"
                    placeholder="DEUTDEDB"
                    value={newSwift}
                    onChange={(e) => setNewSwift(e.target.value)}
                  />
                </div> */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="setAsDefault">
                      {t('form.setAsDefault')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('form.setAsDefaultDescription')}
                    </p>
                  </div>
                  <Switch
                    id="setAsDefault"
                    checked={setAsDefault}
                    onCheckedChange={setSetAsDefault}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isPending}
                >
                  {t('form.cancel')}
                </Button>
                <Button onClick={handleAddAccount} disabled={isPending}>
                  {pendingAction === 'add' ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t('form.adding')}
                    </>
                  ) : (
                    t('form.add')
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {bankAccounts.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t('noAccounts')}
            </p>
          ) : (
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.iban}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <CreditCard className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {formatIban(account.iban)}
                        </p>
                        {account.is_default && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Star className="size-3" />
                            {t('default')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.holder}
                        {account.bank && ` • ${account.bank}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.is_default && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(account.iban)}
                          disabled={isPending}
                        >
                          {pendingAction === `default-${account.iban}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-2 size-4" />
                              {t('setDefault')}
                            </>
                          )}
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(account.iban)}
                          disabled={isPending}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {pendingAction === `delete-${account.iban}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button> */}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
