'use client'

import { Button } from '@/components/ui/button'
import { DocumentType } from '@/types/document-type'
import { cn } from '@/utils/tailwind/cn'
import { FileObject } from '@supabase/storage-js'
import { format } from 'date-fns'
import { File, Loader2, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { deleteFile, uploadFile } from './actions'

interface UploadFieldProps {
  title: string
  type: DocumentType
  file: FileObject | undefined
  onFileUpload: (success: boolean) => void
  onFileDelete: (success: boolean) => void
}

export function UploadField({
  title,
  type,
  file,
  onFileUpload,
  onFileDelete,
}: UploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('onboarding.uboAml')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      upload(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      upload(selectedFile)
    }
  }

  const upload = async (file: File) => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const result = await uploadFile(formData)

    setIsLoading(false)

    onFileUpload(result.success)
  }

  const handleFileDelete = async () => {
    setIsLoading(true)
    const result = await deleteFile(type)
    setIsLoading(false)
    onFileDelete(result.success)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" htmlFor={type}>
          {title}
        </label>
        <span className="text-destructive">*</span>
      </div>
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed p-4 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25',
          'hover:border-primary hover:bg-primary/5',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="size-5" />
              <span className="font-medium">
                {file.name}{' '}
                <span className="text-xs font-normal">
                  {format(new Date(file.updated_at), 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              ) : (
                <X className="size-4" />
              )}
            </Button>
          </div>
        ) : (
          <label
            htmlFor={`file-${type}`}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="size-8 text-muted-foreground" />
            )}
            <div className="text-center">
              <p>{t('files.hint1')}</p>
              <p className="text-sm text-muted-foreground">
                {t('files.hint2')}
              </p>
            </div>
            <input
              id={`file-${type}`}
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </label>
        )}
      </div>
    </div>
  )
}
