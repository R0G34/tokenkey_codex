'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { Trash2, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Roles } from '../../personal-data/roles'
import { updateBeneficialOwners } from './actions'
import { BeneficialOwner } from './beneficial-owner-type'
import { useBeneficialOwners } from './beneficial-owners-context'

export function BeneficialOwnersList() {
  const router = useRouter()
  const {
    company,
    formState,
    personalData,
    setFormState,
    setAddingRepresentative,
  } = useBeneficialOwners()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const t = useTranslations('onboarding.beneficialOwners.list')

  const beneficialOwners = (
    company.beneficial_owners as BeneficialOwner[] | null
  )?.map((ben) => ({
    ...ben,
    birthdate: new Date(ben.birthdate),
  }))

  const accountOwnerRepresentative = (personalData.roles as Roles)
    .representative
    ? { forename: personalData.forename, surname: personalData.surname }
    : null

  const handleAddPerson = () => {
    setAddingRepresentative(null)
    setFormState('form')
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    await updateBeneficialOwners(
      beneficialOwners!.filter((ben) => ben.id !== deletingId),
    )
    router.refresh()
    setDeleteConfirmOpen(false)
    setDeletingId(null)
  }

  return (
    <>
      <div className="space-y-2">
        {accountOwnerRepresentative && (
          <div className="flex items-center justify-between rounded-lg bg-muted p-3">
            <div>
              <p className="font-medium">
                {accountOwnerRepresentative.forename}{' '}
                {accountOwnerRepresentative.surname}
              </p>
            </div>
          </div>
        )}
        {beneficialOwners?.map((beneficialOwner) => (
          <div
            key={beneficialOwner.id}
            className="flex items-center justify-between rounded-lg bg-muted p-3"
          >
            <div>
              <p className="font-medium">
                {beneficialOwner.forename} {beneficialOwner.surname}
              </p>
              {/* <p className="text-sm text-muted-foreground">{owner.details}</p> */}
            </div>
            <div className="flex gap-2">
              {/* <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEdit(beneficialOwner)}
              >
                <Pencil className="size-4" />
              </Button> */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(beneficialOwner.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {formState === 'list' && (
        <Button
          onClick={handleAddPerson}
          variant="secondary"
          // className="mt-4 w-full"
          className="mt-4"
        >
          <UserPlus className="mr-2 size-4" />
          {t('addButton')}
        </Button>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('alert.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('alert.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('alert.continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
