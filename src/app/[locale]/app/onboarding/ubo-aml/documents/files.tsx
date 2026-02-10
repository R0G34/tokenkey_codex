'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from '@/i18n/navigation'
import { DocumentType } from '@/types/document-type'
import { getAreAllFilesUploaded } from '@/utils/files'
import { FileObject } from '@supabase/storage-js'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { UploadField } from './upload-field'

interface Props {
  files: { [key in DocumentType]: FileObject }
  hasPowerOfAttorney: boolean
}

export function Files({ files, hasPowerOfAttorney }: Props) {
  const router = useRouter()
  const t = useTranslations('onboarding.uboAml')
  const [isPending, startTransition] = useTransition()

  const handleFileUpload = (success: boolean) => {
    if (success) {
      toast.success('File uploaded successfully')
    } else {
      toast.error('Failed to upload file')
    }
  }

  const handleFileDelete = async (success: boolean) => {
    if (success) {
      toast.success('File deleted successfully')
    } else {
      toast.error('Failed to delete file')
    }
  }

  const areAllFilesUploaded = getAreAllFilesUploaded(files, hasPowerOfAttorney)

  const handleAcceptAndContinue = async () => {
    startTransition(async () => {
      if (areAllFilesUploaded) router.push('/app/onboarding/wphg')
    })
  }

  return (
    <div className="space-y-6">
      <UploadField
        title={t('files.commercialRegister')}
        type="commercialRegister"
        file={files.commercialRegister}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />

      <UploadField
        title={t('files.shareholdersAgreement')}
        type="shareholdersAgreement"
        file={files.shareholdersAgreement}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />

      <UploadField
        title={t('files.shareholdersList')}
        type="shareholdersList"
        file={files.shareholdersList}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />

      <UploadField
        title={t('files.transparencyRegister')}
        type="transparencyRegister"
        file={files.transparencyRegister}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
      />

      {hasPowerOfAttorney && (
        <UploadField
          title={t('files.powerOfAttorney')}
          type="powerOfAttorney"
          file={files.powerOfAttorney}
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
        />
      )}

      <Button
        onClick={handleAcceptAndContinue}
        className="w-full"
        disabled={!areAllFilesUploaded || isPending}
      >
        {t('acceptAndContinue')}
        {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      </Button>
    </div>
  )
}
