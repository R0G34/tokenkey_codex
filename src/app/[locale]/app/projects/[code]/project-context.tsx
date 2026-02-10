'use client'

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface ProjectContextType {
  setShowImageDialog: Dispatch<SetStateAction<number | undefined>>
  setShowInvestDialog: Dispatch<SetStateAction<boolean>>
  showImageDialog: number | undefined
  showInvestDialog: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context)
    throw new Error('useProject must be used within an ProjectProvider')
  return context
}

interface ProjectProviderProps {
  children: ReactNode
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [showImageDialog, setShowImageDialog] = useState<number | undefined>(
    undefined,
  )
  const [showInvestDialog, setShowInvestDialog] = useState(false)

  return (
    <ProjectContext.Provider
      value={{
        showImageDialog,
        setShowImageDialog,
        showInvestDialog,
        setShowInvestDialog,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
