import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { SubCategory } from '../data/schema'

type CategoryDialogType = 'create-category' | 'create-subCategory' | 'update' | 'delete' | 'import'

interface CategoryContextType {
  open: CategoryDialogType | null
  setOpen: (str: CategoryDialogType | null) => void
  currentRow: SubCategory | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SubCategory | null>>
}

const CategoryContext = React.createContext<CategoryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CategoryProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CategoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SubCategory | null>(null)
  return (
    <CategoryContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = () => {
  const categoryContext = React.useContext(CategoryContext)

  if (!categoryContext) {
    throw new Error('useCategory must be used within <CategoryProvider>')
  }

  return categoryContext
}