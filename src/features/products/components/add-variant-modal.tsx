import { useState, useEffect } from 'react'
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
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi'

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
    existingVariant?.values || [{ value: '' }]
  )

  const isEditing = !!existingVariant

  // Add this useEffect to update state when existingVariant changes
  useEffect(() => {
    if (existingVariant) {
      setName(existingVariant.name || '')
      setValues(existingVariant.values || [{ value: '' }])
    } else {
      // Reset form when not editing
      resetForm()
    }
  }, [existingVariant, open])

  const resetForm = () => {
    setName('')
    setValues([{ value: '' }])
  }

  const handleAddValue = () => {
    setValues([...values, { value: '' }])
  }

  const handleValueChange = (index: number, newValue: string) => {
    const updatedValues = [...values]
    updatedValues[index].value = newValue
    setValues(updatedValues)
  }

  const handleRemoveValue = (index: number) => {
    if (values.length === 1) {
      toast({
        title: 'Cannot remove',
        description: 'A variant must have at least one value',
      })
      return
    }
    
    const updatedValues = values.filter((_, i) => i !== index)
    setValues(updatedValues)
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Variant name required',
        description: 'Please enter a name for this variant',
      })
      return
    }

    const filteredValues = values.filter(v => v.value.trim() !== '')
    
    if (filteredValues.length === 0) {
      toast({
        title: 'Variant values required',
        description: 'Please add at least one value for this variant',
      })
      return
    }

    const variant: Variant = {
      id: existingVariant?.id,
      name: name.trim(),
      values: filteredValues,
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
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Variant</DialogTitle>
          <DialogDescription>
            Create a variant like Size or Color with multiple values.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="variant-name" className="text-sm font-medium">
              Variant Name
            </label>
            <Input
              id="variant-name"
              placeholder="E.g., Size, Color, Material"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Values</label>
            {values.map((valueObj, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`E.g., ${name === 'Size' ? 'S, M, L' : name === 'Color' ? 'Red, Blue' : 'Value'}`}
                  value={valueObj.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveValue(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              onClick={handleAddValue}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <HiOutlinePlusCircle className="w-5 h-5" />
              <span>Add Another Value</span>
            </Button>
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