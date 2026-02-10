'use client'

import { cn } from '@/utils/tailwind/cn'
import { Maximize2 } from 'lucide-react'
import { useProject } from '../project-context'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export default function MaximizeButton({ className = '' }: Props) {
  const { setShowImageDialog } = useProject()
  return (
    <button
      onClick={() => setShowImageDialog(0)}
      className={cn(
        'absolute right-1 bottom-1 rounded-md bg-background/80 p-1 transition-colors hover:bg-background',
        'transition-opacity duration-300 ease-in-out',
        className,
      )}
    >
      <Maximize2 className="size-4" />
    </button>
  )
}
