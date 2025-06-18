import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi'
import { AddVariantModal, Variant } from './add-variant-modal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SubCategory } from '@/features/subcategories/data/schema'
import { Product } from '../data/schema'
import { useCategories } from '@/context/category/category-context'
import { useSubCategories } from '@/context/category/subcategory-context'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Product
  baseUrl?: string
  isCategory?: boolean
  isVariant?: boolean
}



const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().min(1, 'Description is required.'),
  price: z.number().min(0, 'Price must be a positive number.'),
  inventory: z.number().min(0, 'Inventory must be a positive number.'),
  categoryId: z.string().min(1, 'Category is required.'),
  subCategoryId: z.string().min(1, 'Sub-category is required.'),
  productId: z.string().optional(),
})

type ProductForm = z.infer<typeof formSchema>
const MAX_IMAGES = 5;

export function ProductsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  baseUrl = import.meta.env.VITE_BASE_URL as string,
}: Props) {
  const isUpdate = !!currentRow
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  // const [additionalInfo, setAdditionalInfo] = useState<{ key: string; value: string }[]>([
  //   { key: '', value: '' }
  // ])
  const [variants, setVariants] = useState<Variant[]>([])
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<Variant | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { categories } = useCategories()
  const { subCategories } = useSubCategories()
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([])

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ? {
      name: currentRow.name,
      description: currentRow.description,
      price: currentRow.basePrice,
      inventory: currentRow.inventory ? currentRow.inventory[0].quantity : 0,
      categoryId: currentRow.categoryId ?? '',
      subCategoryId: currentRow.subCategoryId ?? '',
      productId: currentRow.id,
    } : {
      name: '',
      description: '',
      price: 0,
      inventory: 0,
      categoryId: '',
      subCategoryId: '',
      productId: '',
    },
  })

  useEffect(() => {
    if (isUpdate && currentRow) {
      setUploadedImages(currentRow.images || [])
      // setAdditionalInfo(currentRow.additionalInfo || [{ key: '', value: '' }])
      setVariants([])
    } else {
      setUploadedImages([])
      //setAdditionalInfo([{ key: '', value: '' }])
      setVariants([])
    }
  }, [isUpdate, currentRow, open])

  useEffect(() => {
    // Filter subcategories based on selected category
    const categoryId = form.watch('categoryId')
    if (categoryId && subCategories) {
      const filtered = subCategories.filter(sub => sub.categoryId === categoryId)
      setFilteredSubCategories(filtered)
    } else {
      setFilteredSubCategories([])
    }
  }, [form.watch('categoryId'), subCategories])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files)
      addFiles(filesArray)
    }
  }

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length !== files.length) {
      toast({
        title: 'Some files were skipped',
        description: 'Only image files are accepted.',
      })
    }

    if (imageFiles.length === 0) return
    const totalCount = selectedFiles.length + uploadedImages.length + imageFiles.length

    if (totalCount > MAX_IMAGES) {
      toast({
        title: 'Maximum images limit reached',
        description: `You can only upload a maximum of ${MAX_IMAGES} images. ${MAX_IMAGES - uploadedImages.length} slots remaining.`,
      })
      const remainingSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length
      if (remainingSlots <= 0) return

      const limitedFiles = imageFiles.slice(0, remainingSlots)
      setSelectedFiles((prev) => [...prev, ...limitedFiles])
      const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    } else {
      setSelectedFiles((prev) => [...prev, ...imageFiles])
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      addFiles(filesArray)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleBrowseClick = () => {
    if (uploadedImages.length >= MAX_IMAGES) {
      toast({
        title: 'Maximum images limit reached',
        description: `You can only upload a maximum of ${MAX_IMAGES} images.`,
      })
      return
    }

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeSelectedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index])
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No images selected for upload',
        description: 'Please select at least one image.',
      })
      return
    }
    if (uploadedImages.length + selectedFiles.length > MAX_IMAGES) {
      const remainingSlots = MAX_IMAGES - uploadedImages.length
      toast({
        title: 'Too many images',
        description: `You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}.`,
      })
      return
    }

    const form = new FormData()
    selectedFiles.forEach((file) => {
      form.append('files', file)
    })

    try {
      toast({
        title: 'Uploading images...',
      })

      const response = await fetch(`${baseUrl}/product/upload/images`, {
        method: 'POST',
        credentials: 'include',
        body: form,
        headers: {
         
        },
      })

      if (!response.ok) {
        toast({
          title: 'Failed to upload images',
          description: 'Please try again.',
        })
        return
      }

      const data = await response.json()
      setUploadedImages((prev) => [
        ...prev,
        ...data.map((d: { url: string }) => d.url)
      ])

      setSelectedFiles([])
      setPreviewUrls([])

      toast({
        title: 'Images uploaded successfully',
      })
    } catch (error) {
      ////console.error('Error uploading images:', error)
      toast({
        title: 'Failed to upload images',
        description: 'Please try again.',
      })
    }
  }

  // const handleAdditionalInfoChange = (index: number, field: 'key' | 'value', value: string) => {
  //   const newAdditionalInfo = [...additionalInfo]
  //   newAdditionalInfo[index][field] = value
  //   setAdditionalInfo(newAdditionalInfo)
  // }

  // const addKeyValuePair = () => {
  //   setAdditionalInfo([...additionalInfo, { key: '', value: '' }])
  // }

  // const removeKeyValuePair = (index: number) => {
  //   const newAdditionalInfo = additionalInfo.filter((_, i) => i !== index)
  //   setAdditionalInfo(newAdditionalInfo)
  // }

  const handleSaveVariant = (variant: Variant) => {
    if (currentVariant) {
      // Update existing variant
      setVariants(variants.map(v => v.id === variant.id ? variant : v))
      setCurrentVariant(undefined)
    } else {
      // Add new variant with generated ID if not provided
      const newVariant = {
        ...variant,
        id: variant.id || `variant-${Date.now()}`
      }
      setVariants([...variants, newVariant])
    }
    setIsVariantModalOpen(false)
  }

  const handleEditVariant = (variant: Variant) => {
    setCurrentVariant(variant)
    setIsVariantModalOpen(true)
  }

  const handleRemoveVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId))
  }

  // Find the onSubmit function in your ProductsMutateDrawer component and update it like this:
  const onSubmit = async (data: ProductForm) => {
    if (uploadedImages.length === 0) {
      toast({
        title: 'Images required',
        description: 'Please upload at least one image for the product.',
      })
      return
    }

    // const filteredAdditionalInfo = additionalInfo.filter(
    //   (item) => item.key.trim() !== '' && item.value.trim() !== ''
    // )

    // Transform variants to the required format
    const formattedOptions = variants.map(variant => ({
      name: variant.name,
      values: variant.values.map(v => v.value)
    }))

    const formData = {
      ...data,
      basePrice: data.price,
      images: uploadedImages,
      // additionalInfo: filteredAdditionalInfo,
      options: formattedOptions, // Use the transformed format
    }

    const url = `${baseUrl}/product/${isUpdate ? `update/${currentRow && currentRow.id}` : 'create'}`

    try {
      const response = await fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        toast({
          title: `Failed to ${isUpdate ? 'update' : 'create'} product`,
          description: 'Please try again.',
        })
        return
      }

      // const responseData = await response.json()
      // console.log(responseData)

      onOpenChange(false)
      form.reset()
      setUploadedImages([])
      setSelectedFiles([])
      setPreviewUrls([])
      //setAdditionalInfo([{ key: '', value: '' }])
      setVariants([])

      toast({
        title: `Product ${isUpdate ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      //console.error(`Error ${isUpdate ? 'updating' : 'creating'} product:`, error)
      toast({
        title: `Failed to ${isUpdate ? 'update' : 'create'} product`,
        description: 'Please try again.',
      })
    }
  }
  const remainingImageSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length;
  const canAddMoreImages = remainingImageSlots > 0;

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) {
          form.reset()
          setUploadedImages([])
          setSelectedFiles([])
          setPreviewUrls([])
          // setAdditionalInfo([{ key: '', value: '' }])
          setVariants([])

          previewUrls.forEach(url => URL.revokeObjectURL(url))
        }
      }}
    >
      <SheetContent className="flex flex-col overflow-y-auto max-h-screen w-full">
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'} Product
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the product by providing necessary info.'
              : 'Add a new product by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='product-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 mt-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter the product name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Enter the product description'
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={currentRow?.categoryId ?? ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={currentRow?.subCategoryId ?? ''}
                      disabled={!form.watch('categoryId')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubCategories.map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the price'
                      type='number'
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='inventory'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Inventory</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the inventory'
                      type='number'
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="space-y-2">
              <FormLabel>Attributes</FormLabel>

              {additionalInfo.map((info, index) => (
                <div key={index} className="flex md:flex-row flex-col items-center gap-2 mb-2">
                  <Input
                    placeholder="Key (e.g., Material)"
                    value={info.key}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, 'key', e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value (e.g., Cotton)"
                    value={info.value}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, 'value', e.target.value)
                    }
                    className="flex-1"
                  />
                  {additionalInfo.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyValuePair(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={addKeyValuePair}
                className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <HiOutlinePlusCircle className="w-5 h-5" />
                <span>Add Attributes</span>
              </Button>
            </div> */}

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Product Images</FormLabel>
                <span className="text-sm text-gray-500">
                  {uploadedImages.length} of {MAX_IMAGES} images
                </span>
              </div>

              {canAddMoreImages ? (
                <div
                  className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-md ${!canAddMoreImages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    } ${isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors duration-200`}
                  onDrop={canAddMoreImages ? handleDrop : undefined}
                  onDragOver={canAddMoreImages ? handleDragOver : undefined}
                  onDragEnter={canAddMoreImages ? handleDragEnter : undefined}
                  onDragLeave={canAddMoreImages ? handleDragLeave : undefined}
                  onClick={canAddMoreImages ? handleBrowseClick : undefined}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className={`w-8 h-8 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to select</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG (MAX. 1000x1000px) - {remainingImageSlots} slot{remainingImageSlots !== 1 ? 's' : ''} left
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full py-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-500">Maximum of {MAX_IMAGES} images allowed. Remove some images to add more.</p>
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Selected preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md"></div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering file input click
                            removeSelectedImage(index);
                          }}
                        >
                          <HiOutlineTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={handleUploadImages}
                    variant="secondary"
                    className="w-full"
                  >
                    Upload Selected Images
                  </Button>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Uploaded Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md"></div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadedImage(index);
                          }}
                        >
                          <HiOutlineTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Variants Section */}
            {!isUpdate && <div className="space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Product Variants</FormLabel>
                <span className="text-sm text-gray-500">
                  {variants.length} variant(s)
                </span>
              </div>

              {variants.length > 0 && (
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <Card key={variant.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{variant.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVariant(variant)}
                              className="text-blue-600 hover:text-blue-800 h-8"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariant(variant.id || '')}
                              className="text-red-500 hover:text-red-700 h-8"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variant.values.map((value, vIndex) => (
                            <Badge key={vIndex} variant="secondary">
                              {value.value}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setCurrentVariant(undefined)
                  setIsVariantModalOpen(true)
                }}
              >
                <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                Add Variant
              </Button>
            </div>}
          </form>
        </Form>
        <SheetFooter className="mt-5 gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="product-form" type="submit">
            {isUpdate ? 'Update' : 'Create'} Product
          </Button>
        </SheetFooter>
        <AddVariantModal
          open={isVariantModalOpen}
          onOpenChange={setIsVariantModalOpen}
          onSave={handleSaveVariant}
          existingVariant={currentVariant}
        />
      </SheetContent>
    </Sheet>
  )
}