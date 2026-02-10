'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { NaturalRepresentative } from '../(representatives)/representative-type'
import { BeneficialOwner } from './beneficial-owner-type'

// export const beneficialOwnerSchema = z.object({
//   id: z.string(),
//   type: z.enum(['natural', 'legal']),
//   name: z.string(),
//   details: z.string(),
// })

// export type BeneficialOwner = z.infer<typeof beneficialOwnerSchema>

type FormState = 'list' | 'form'

interface BeneficialOwnersContextType {
  company: Tables<'company'>
  personalData: Tables<'personal_data'>
  formState: FormState
  addingRepresentative: NaturalRepresentative | null
  setAddingRepresentative: React.Dispatch<
    React.SetStateAction<NaturalRepresentative | null>
  >
  editingBeneficialOwner: BeneficialOwner | null
  setEditingBeneficialOwner: React.Dispatch<
    React.SetStateAction<BeneficialOwner | null>
  >
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
}

const BeneficialOwnersContext = createContext<
  BeneficialOwnersContextType | undefined
>(undefined)

export const useBeneficialOwners = () => {
  const context = useContext(BeneficialOwnersContext)
  if (!context) {
    throw new Error(
      'useBeneficialOwners must be used within a BeneficialOwnersProvider',
    )
  }
  return context
}

export const BeneficialOwnersProvider: React.FC<{
  children: ReactNode
  initialCompany: Tables<'company'>
  initialPersonalData: Tables<'personal_data'>
}> = ({ children, initialCompany, initialPersonalData }) => {
  const [company, setCompany] = useState(initialCompany)
  const [personalData, setPersonalData] = useState(initialPersonalData)
  const [formState, setFormState] = useState<FormState>('list')
  const [addingRepresentative, setAddingRepresentative] =
    useState<NaturalRepresentative | null>(null)
  const [editingBeneficialOwner, setEditingBeneficialOwner] =
    useState<BeneficialOwner | null>(null)

  useEffect(() => setCompany(initialCompany), [initialCompany])
  useEffect(() => setPersonalData(initialPersonalData), [initialPersonalData])

  return (
    <BeneficialOwnersContext.Provider
      value={{
        company,
        personalData,
        addingRepresentative,
        setAddingRepresentative,
        editingBeneficialOwner,
        formState,
        setFormState,
        setEditingBeneficialOwner,
      }}
    >
      {children}
    </BeneficialOwnersContext.Provider>
  )
}
