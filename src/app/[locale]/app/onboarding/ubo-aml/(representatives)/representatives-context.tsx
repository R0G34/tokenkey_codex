'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  LegalRepresentative,
  NaturalRepresentative,
} from './representative-type'

// export const representativeSchema = z.object({
//   id: z.string(),
//   type: z.enum(['natural', 'legal']),
//   name: z.string(),
//   details: z.string(),
// })

// export type Representative = z.infer<typeof representativeSchema>

type FormState = 'list' | 'natural' | 'legal'

interface RepresentativesContextType {
  company: Tables<'company'>
  personalData: Tables<'personal_data'>
  formState: FormState
  editingNaturalRepresentative: NaturalRepresentative | null
  editingLegalRepresentative: LegalRepresentative | null
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setEditingNaturalRepresentative: React.Dispatch<
    React.SetStateAction<NaturalRepresentative | null>
  >
  setEditingLegalRepresentative: React.Dispatch<
    React.SetStateAction<LegalRepresentative | null>
  >
}

const LegalRepresentativesContext = createContext<
  RepresentativesContextType | undefined
>(undefined)

export const useRepresentatives = () => {
  const context = useContext(LegalRepresentativesContext)
  if (!context) {
    throw new Error(
      'useLegalRepresentatives must be used within a LegalRepresentativesProvider',
    )
  }
  return context
}

export const RepresentativesProvider: React.FC<{
  children: ReactNode
  initialCompany: Tables<'company'>
  initialPersonalData: Tables<'personal_data'>
}> = ({ children, initialCompany, initialPersonalData }) => {
  const [company, setCompany] = useState(initialCompany)
  const [personalData, setPersonalData] = useState(initialPersonalData)
  const [formState, setFormState] = useState<FormState>('list')
  const [editingNaturalRepresentative, setEditingNaturalRepresentative] =
    useState<NaturalRepresentative | null>(null)
  const [editingLegalRepresentative, setEditingLegalRepresentative] =
    useState<LegalRepresentative | null>(null)

  useEffect(() => setCompany(initialCompany), [initialCompany])
  useEffect(() => setPersonalData(initialPersonalData), [initialPersonalData])

  return (
    <LegalRepresentativesContext.Provider
      value={{
        company,
        personalData,
        formState,
        editingNaturalRepresentative,
        editingLegalRepresentative,
        setFormState,
        setEditingNaturalRepresentative,
        setEditingLegalRepresentative,
      }}
    >
      {children}
    </LegalRepresentativesContext.Provider>
  )
}
