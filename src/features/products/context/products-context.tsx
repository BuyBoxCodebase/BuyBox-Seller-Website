import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Product } from '../data/schema'
import { Variant } from '@/hooks/variants/schema'

type ProductDialogType = 'create-product' | 'update' | 'delete' | 'import' | 'variant-option' | 'variant-option-edit' | 'add-variant' | 'edit-variant'

interface ProductContextType {
  open: ProductDialogType | null
  setOpen: (str: ProductDialogType | null) => void
  currentRow: Product | Variant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | Variant | null>>
}

const ProductContext = React.createContext<ProductContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProductDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product |Variant| null>(null)
  return (
    <ProductContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const productContext = React.useContext(ProductContext)

  if (!productContext) {
    throw new Error('useProduct must be used within <ProductProvider>')
  }

  return productContext
}