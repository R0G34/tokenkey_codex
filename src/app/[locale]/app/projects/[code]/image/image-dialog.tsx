'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { Tables } from '@/lib/supabase/types/database.types'
import Image from 'next/image'
import { useProject } from '../project-context'

interface Props {
  images: Tables<'project_image'>[]
}

export default function ImageDialog({ images }: Props) {
  const { setShowImageDialog, showImageDialog: showImageDialog } = useProject()

  if (typeof showImageDialog === 'undefined') return null

  return (
    <Dialog
      open={true}
      onOpenChange={(open) =>
        setShowImageDialog(open ? showImageDialog : undefined)
      }
    >
      <DialogContent className="w-full max-w-7xl">
        <DialogTitle className="hidden" />
        <div className="relative aspect-16/9">
          <Image
            src={images[showImageDialog].url}
            alt="Project"
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
