import { useState, useEffect, KeyboardEvent } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HiX } from 'react-icons/hi'

interface VariantValue {
  id?: string
  value: string
}

export interface Variant {
  id?: string
  name: string
  values: VariantValue[]
}

interface AddVariantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (variant: Variant) => void
  existingVariant?: Variant
}

export function AddVariantModal({
  open,
  onOpenChange,
  onSave,
  existingVariant,
}: AddVariantModalProps) {
  const [name, setName] = useState(existingVariant?.name || '')
  const [values, setValues] = useState<VariantValue[]>(
    existingVariant?.values || []
  )
  const [inputValue, setInputValue] = useState('')

  const isEditing = !!existingVariant

  useEffect(() => {
    if (existingVariant) {
      setName(existingVariant.name || '')
      setValues(existingVariant.values || [])
    } else {
      resetForm()
    }
  }, [existingVariant, open])

  const resetForm = () => {
    setName('')
    setValues([])
    setInputValue('')
  }

  const handleAddTag = (val: string) => {
    const trimmed = val.trim().replace(/,$/, '')
    if (!trimmed) return
    if (values.some(v => v.value.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: 'Duplicate value', description: `${trimmed} is already added.` })
      return
    }
    setValues([...values, { value: trimmed }])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag(inputValue)
      setInputValue('')
    }
  }

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    // If there is lingering input, add it right before saving
    let finalValues = [...values]
    if (inputValue.trim()) {
      const trimmed = inputValue.trim().replace(/,$/, '')
      if (!values.some(v => v.value.toLowerCase() === trimmed.toLowerCase())) {
        finalValues.push({ value: trimmed })
      }
    }

    if (!name.trim()) {
      toast({
        title: 'Variant name required',
        description: 'Please enter a name for this variant',
      })
      return
    }

    if (finalValues.length === 0) {
      toast({
        title: 'Variant values required',
        description: 'Please add at least one value for this variant (press Enter to add a value)',
      })
      return
    }

    const variant: Variant = {
      id: existingVariant?.id,
      name: name.trim(),
      values: finalValues,
    }

    onSave(variant)
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) {
        resetForm()
      }
      onOpenChange(value)
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add Custom'} Variant</DialogTitle>
          <DialogDescription>
            Type a variant name and its values. Press <kbd className="px-1 py-0.5 rounded-sm bg-gray-100 text-xs font-mono">Enter</kbd> to add multiple values quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="variant-name" className="text-sm font-medium">
              Variant Name
            </label>
            <Input
              id="variant-name"
              placeholder="E.g., Material, Flavor, Size"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {name.toLowerCase() === 'size' && (
             <div className="flex gap-2 text-xs flex-wrap">
               <span className="text-gray-500 flex items-center">Suggestions:</span>
               {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                 <Badge key={s} variant="outline" className="cursor-pointer hover:bg-gray-100 text-gray-600" onClick={() => handleAddTag(s)}>+ {s}</Badge>
               ))}
             </div>
          )}

          {name.toLowerCase() === 'color' && (
             <div className="flex gap-2 text-xs flex-wrap">
               <span className="text-gray-500 flex items-center">Suggestions:</span>
               {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow'].map(s => (
                 <Badge key={s} variant="outline" className="cursor-pointer hover:bg-gray-100 text-gray-600" onClick={() => handleAddTag(s)}>+ {s}</Badge>
               ))}
             </div>
          )}

          {name.toLowerCase() === 'material' && (
             <div className="flex gap-2 text-xs flex-wrap">
               <span className="text-gray-500 flex items-center">Suggestions:</span>
               {['Cotton', 'Polyester', 'Leather', 'Denim', 'Silk', 'Wool'].map(s => (
                 <Badge key={s} variant="outline" className="cursor-pointer hover:bg-gray-100 text-gray-600" onClick={() => handleAddTag(s)}>+ {s}</Badge>
               ))}
             </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Values</label>
            <div 
              className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:border-primary bg-white min-h-[80px] items-start"
              onClick={() => document.getElementById('tag-input')?.focus()}
            >
              {values.map((v, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1 text-sm font-normal py-1">
                  {v.value}
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); handleRemoveValue(i) }} 
                    className="text-gray-500 hover:text-red-500 focus:outline-none rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <input
                id="tag-input"
                className="flex-1 outline-none bg-transparent min-w-[120px] text-sm py-1"
                placeholder={values.length === 0 ? "e.g., Cotton, Leather..." : ""}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (inputValue) {
                    handleAddTag(inputValue)
                    setInputValue('')
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500">Press Enter or comma to create a tag</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Update' : 'Add'} Variant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}