'use client'

import { useCarousel } from '@/components/extension/carousel'
import { cn } from '@/utils/tailwind/cn'
import { Maximize2 } from 'lucide-react'
import { useProject } from '../project-context'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export default function ImageCarouselMaximizeButton({ className = '' }: Props) {
  const { activeIndex } = useCarousel()
  const { setShowImageDialog } = useProject()

  return (
    <button
      onClick={() => setShowImageDialog(activeIndex)}
      className={cn(
        'absolute top-4 right-4 z-10 rounded-lg bg-background/80 p-2 transition-colors hover:bg-background',
        'transition-opacity duration-300 ease-in-out',
        className,
      )}
    >
      <Maximize2 className="size-5" />
    </button>
  )
}
