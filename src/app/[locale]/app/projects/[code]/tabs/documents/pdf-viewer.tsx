'use client'

import { Icons } from '@/components/ui/icons'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utils/tailwind/cn'
import { useResizeObserver } from '@wojtekmaj/react-hooks'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { useCallback, useState } from 'react'
import { Document, Page } from 'react-pdf'
// https://github.com/wojtekmaj/react-pdf/issues/1824#issuecomment-2266150831
import { useTranslations } from 'next-intl'
import 'pdfjs-dist/build/pdf.worker.min.mjs'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
}

const resizeObserverOptions = {}

// const maxWidth = 576
const maxWidth = 800

export default function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const t = useTranslations('project.document')

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries
    if (entry) setContainerWidth(entry.contentRect.width)
  }, [])

  useResizeObserver(containerRef, resizeObserverOptions, onResize)

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy): void {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  return (
    <div ref={setContainerRef}>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        // options={options}
      >
        {/* {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={
              containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
            }
          />
        ))} */}
        <Page
          // canvasBackground={`rgb(170 127 0)`}
          loading={
            <div className="flex items-center justify-center">
              <Icons.spinner className="size-8 animate-spin text-primary" />
            </div>
          }
          pageNumber={pageNumber}
          // width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
          width={containerWidth ? containerWidth : maxWidth}
        />
      </Document>
      {(numPages || 0) > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  'cursor-pointer',
                  pageNumber <= 1 ? 'pointer-events-none' : '',
                )}
                onClick={previousPage}
              />
            </PaginationItem>
            <p>
              {pageNumber || (numPages ? 1 : '--')} {t('of')} {numPages || '--'}
            </p>
            <PaginationItem>
              <PaginationNext
                className={cn(
                  'cursor-pointer',
                  !numPages || pageNumber >= numPages
                    ? 'pointer-events-none'
                    : '',
                )}
                onClick={nextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
