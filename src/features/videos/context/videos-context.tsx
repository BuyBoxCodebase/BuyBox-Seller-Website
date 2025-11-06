import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Variant } from '@/hooks/variants/schema'
import { Videos } from '../data/schema'

type VideosDialogType = 'create-videos' | 'update' | 'delete' | 'import' | 'variant-option' | 'variant-option-edit' | 'add-variant' | 'edit-variant'

interface VideosContextType {
  open: VideosDialogType | null
  setOpen: (str: VideosDialogType | null) => void
  currentRow: Videos | Variant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Videos | Variant | null>>
}

const VideosContext = React.createContext<VideosContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function VideosProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<VideosDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Videos |Variant| null>(null)
  return (
    <VideosContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VideosContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVideos = () => {
  const videosContext = React.useContext(VideosContext)

  if (!videosContext) {
    throw new Error('useVideos must be used within <VideosProvider>')
  }

  return videosContext
}