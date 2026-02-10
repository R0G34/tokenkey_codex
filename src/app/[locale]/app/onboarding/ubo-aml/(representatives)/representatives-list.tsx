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
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Roles } from '../../personal-data/roles'
import { deleteRepresentative } from './actions'
import { Representative, RepresentativePersonType } from './representative-type'
import { useRepresentatives } from './representatives-context'

export const RepresentativesList = () => {
  const router = useRouter()
  const {
    company,
    personalData,
    setFormState,
    setEditingNaturalRepresentative,
    setEditingLegalRepresentative,
  } = useRepresentatives()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const t = useTranslations('onboarding.representatives')

  const representatives = company.representatives as Representative[] | null

  const accountOwnerRepresentative = (personalData.roles as Roles)
    .representative
    ? { forename: personalData.forename, surname: personalData.surname }
    : null

  const handleEdit = (rep: Representative) => {
    if (rep.type === RepresentativePersonType.Natural)
      setEditingNaturalRepresentative(rep)
    if (rep.type === RepresentativePersonType.Legal)
      setEditingLegalRepresentative(rep)
    setFormState(
      rep.type === RepresentativePersonType.Natural ? 'natural' : 'legal',
    )
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    await deleteRepresentative(company, deletingId)
    router.refresh()
    setDeleteConfirmOpen(false)
    setDeletingId(null)
  }

  return (
    <>
      <ul className="space-y-2">
        {accountOwnerRepresentative && (
          <li className="flex h-14 items-center justify-between rounded-md bg-muted p-2">
            <div>
              <span className="font-medium">
                {accountOwnerRepresentative.forename}{' '}
                {accountOwnerRepresentative.surname}
              </span>
              {/* <span className="ml-2 text-sm text-muted-foreground">
                details
              </span> */}
            </div>
          </li>
        )}
        {representatives?.map((rep) => (
          <li
            key={rep.key}
            className="flex items-center justify-between rounded-md bg-muted p-2"
          >
            {rep.type === RepresentativePersonType.Natural ? (
              <div>
                <span className="font-medium">
                  {rep.forename} {rep.surname}
                </span>
                {/* <span className="ml-2 text-sm text-muted-foreground">
                details
              </span> */}
              </div>
            ) : rep.type === RepresentativePersonType.Legal ? (
              <div>
                <span className="font-medium">{rep.name}</span>
                {/* <span className="ml-2 text-sm text-muted-foreground">
                details
              </span> */}
              </div>
            ) : null}
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(rep)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(rep.key)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('alertDeleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('alertDeleteConfirm.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('alertDeleteConfirm.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('alertDeleteConfirm.continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
