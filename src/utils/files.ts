import { DocumentType } from '@/types/document-type'
import { FileObject } from '@supabase/storage-js'

export const getAreAllFilesUploaded = (
  files: { [key in DocumentType]: FileObject },
  hasPowerOfAttorney: boolean,
) => {
  const requiredFiles = [
    'commercialRegister',
    'shareholdersAgreement',
    'shareholdersList',
    'transparencyRegister',
  ]

  if (hasPowerOfAttorney) requiredFiles.push('powerOfAttorney')

  return requiredFiles.every((type) =>
    Object.values(files).some((f) => type === f.name.split('.')[0]),
  )
}
