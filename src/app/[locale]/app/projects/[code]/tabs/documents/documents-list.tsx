'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tables } from '@/lib/supabase/types/database.types'
import { cn } from '@/utils/tailwind/cn'
import { saveAs } from 'file-saver'
import {
  Download,
  Eye,
  FileCheck,
  FileIcon,
  FileImageIcon as PdfIcon,
} from 'lucide-react'
import { useState } from 'react'
import PdfViewer from './pdf-viewer'

interface Props {
  documents: Tables<'project_document'>[]
}

export function DocumentsList({ documents }: Props) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<
    Tables<'project_document'>['id'] | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedDocument = documents.find(({ id }) => id === selectedDocumentId)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon className="size-5 text-red-500" />
      // case 'image':
      //   return <ImageIcon className="size-5 text-blue-500" />
      // case 'text':
      //   return <FileTextIcon className="size-5 text-green-500" />
      default:
        return <FileIcon className="size-5 text-gray-500" />
    }
  }

  const renderPreview = (document: Tables<'project_document'>) => {
    switch (/* document.type */ 'pdf') {
      case 'pdf':
        // return <iframe src={document.filename} className="h-[80vh] w-full" />
        return <PdfViewer src={document.filename} />
      // case 'image':
      //   return (
      //     <img
      //       src={document.url || '/placeholder.svg'}
      //       alt={document.name}
      //       className="max-h-[80vh] max-w-full object-contain"
      //     />
      //   )
      default:
        return (
          <p>
            Preview not available for this file type. Please download to view.
          </p>
        )
    }
  }

  const viewPdf = (doc: Tables<'project_document'>) => {
    setSelectedDocumentId(doc.id)
    setIsDialogOpen(true)
  }

  const downloadPdf = async (doc: Tables<'project_document'>) => {
    saveAs(doc.filename, doc.key)
  }

  return (
    <>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className={cn(
              'flex items-center justify-between rounded-lg border p-4 transition-colors',
              doc.filename ? '' : 'cursor-default opacity-50',
            )}
          >
            <div className="flex items-center gap-3">
              <FileCheck className="size-5 text-primary" />
              <span className="font-medium">{doc.type}</span>
            </div>
            <div className="space-x-1">
              <Button
                onClick={() => doc.filename && viewPdf(doc)}
                size="icon"
                variant="outline"
              >
                <Eye className="size-4 text-muted-foreground" />
              </Button>
              <Button
                onClick={() => doc.filename && downloadPdf(doc)}
                size="icon"
                variant="outline"
              >
                <Download className="size-4 text-muted-foreground" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-dvh max-w-4xl overflow-y-scroll sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
          </DialogHeader>
          {selectedDocument && renderPreview(selectedDocument)}
          {/* <DialogFooter>{selectedDocument?.type}</DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  )
}
