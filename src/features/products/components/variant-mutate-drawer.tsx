import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

//import { HiOutlineTrash } from 'react-icons/hi'

import { Checkbox } from '@/components/ui/checkbox'

import { Textarea } from '@/components/ui/textarea'
import { Variant } from '@/hooks/variants/schema'
import useGetOptionValues from '@/hooks/variants/useGetOptionValues'


interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Variant
    baseUrl?: string
    isUpdate?: boolean
}


const formSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.string(),
    stockQuantity: z.string(),
    isDefault: z.boolean().optional(),
    images: z.array(z.string()).optional(),
    optionValueIds: z.array(z.string()).optional(),
})

type ProductForm = z.infer<typeof formSchema>
//const MAX_IMAGES = 5;

export function CreateVariantMutateDrawer({
    open,
    onOpenChange,
    currentRow,
    baseUrl = import.meta.env.VITE_BASE_URL as string,
    isUpdate = false,
}: Props) {
    //const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    //const [isDragging, setIsDragging] = useState(false)
    // const fileInputRef = useRef<HTMLInputElement>(null)
    const { options: availableVariants } = useGetOptionValues((isUpdate ? currentRow?.productId : currentRow?.id) as string);
    // console.log(currentRow)
    const form = useForm<ProductForm>({
        resolver: zodResolver(formSchema),
        defaultValues: currentRow?.id ? {
            name: currentRow.name,
            description: currentRow.description,
            price: String(currentRow.price),
            stockQuantity: currentRow.inventory ? String(currentRow.inventory[0]?.quantity) : '0',
            isDefault: currentRow.isDefault,
            optionValueIds: currentRow.options?.map((option) => option.optionValue.id) || [],
        } : {
            name: '',
            description: '',
            price: '0',
            stockQuantity: '0',
            isDefault: false,
        },
    })

    useEffect(() => {
        if (isUpdate && currentRow) {
            setUploadedImages(currentRow.images || [])

        } else {
            setUploadedImages([])
        }
    }, [isUpdate, currentRow, open])

    // const addFiles = (files: File[]) => {
    //     const imageFiles = files.filter(file => file.type.startsWith('image/'))

    //     if (imageFiles.length !== files.length) {
    //         toast({
    //             title: 'Some files were skipped',
    //             description: 'Only image files are accepted.',
    //         })
    //     }

    //     if (imageFiles.length === 0) return
    //     const totalCount = selectedFiles.length + uploadedImages.length + imageFiles.length

    //     if (totalCount > MAX_IMAGES) {
    //         toast({
    //             title: 'Maximum images limit reached',
    //             description: `You can only upload a maximum of ${MAX_IMAGES} images. ${MAX_IMAGES - uploadedImages.length} slots remaining.`,
    //         })
    //         const remainingSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length
    //         if (remainingSlots <= 0) return

    //         const limitedFiles = imageFiles.slice(0, remainingSlots)
    //         setSelectedFiles((prev) => [...prev, ...limitedFiles])
    //         const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file))
    //         setPreviewUrls((prev) => [...prev, ...newPreviews])
    //     } else {
    //         setSelectedFiles((prev) => [...prev, ...imageFiles])
    //         const newPreviews = imageFiles.map((file) => URL.createObjectURL(file))
    //         setPreviewUrls((prev) => [...prev, ...newPreviews])
    //     }
    // }

    // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files) {
    //         const filesArray = Array.from(event.target.files)
    //         addFiles(filesArray)
    //     }
    // }

    // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     setIsDragging(false)

    //     if (e.dataTransfer.files.length > 0) {
    //         const filesArray = Array.from(e.dataTransfer.files)
    //         addFiles(filesArray)
    //     }
    // }

    // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    // }

    // const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     setIsDragging(true)
    // }

    // const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    //         setIsDragging(false)
    //     }
    // }

    // const handleBrowseClick = () => {
    //     if (uploadedImages.length >= MAX_IMAGES) {
    //         toast({
    //             title: 'Maximum images limit reached',
    //             description: `You can only upload a maximum of ${MAX_IMAGES} images.`,
    //         })
    //         return
    //     }

    //     if (fileInputRef.current) {
    //         fileInputRef.current.click()
    //     }
    // }

    // const removeSelectedImage = (index: number) => {
    //     setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    //     setPreviewUrls((prev) => {
    //         const newPreviews = [...prev]
    //         URL.revokeObjectURL(newPreviews[index])
    //         newPreviews.splice(index, 1)
    //         return newPreviews
    //     })
    // }

    // const removeUploadedImage = (index: number) => {
    //     setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    // }

    // const handleUploadImages = async () => {
    //     if (selectedFiles.length === 0) {
    //         toast({
    //             title: 'No images selected for upload',
    //             description: 'Please select at least one image.',
    //         })
    //         return
    //     }
    //     if (uploadedImages.length + selectedFiles.length > MAX_IMAGES) {
    //         const remainingSlots = MAX_IMAGES - uploadedImages.length
    //         toast({
    //             title: 'Too many images',
    //             description: `You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}.`,
    //         })
    //         return
    //     }

    //     const form = new FormData()
    //     selectedFiles.forEach((file) => {
    //         form.append('files', file)
    //     })

    //     try {
    //         toast({
    //             title: 'Uploading images...',
    //         })

    //         const response = await fetch(`${baseUrl}/brand/upload/images`, {
    //             method: 'POST',
    //             body: form,
    //             headers: {
    //                 Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    //             },
    //         })

    //         if (!response.ok) {
    //             toast({
    //                 title: 'Failed to upload images',
    //                 description: 'Please try again.',
    //             })
    //             return
    //         }

    //         const data = await response.json()
    //         setUploadedImages((prev) => [
    //             ...prev,
    //             ...data.map((d: { url: string }) => d.url)
    //         ])

    //         setSelectedFiles([])
    //         setPreviewUrls([])

    //         toast({
    //             title: 'Images uploaded successfully',
    //         })
    //     } catch (error) {
    //         //console.error('Error uploading images:', error)
    //         toast({
    //             title: 'Failed to upload images',
    //             description: 'Please try again.',
    //         })
    //     }
    // }

    const onSubmit = async (data: ProductForm) => {
        // if (uploadedImages.length === 0) {
        //     toast({
        //         title: 'Images required',
        //         description: 'Please upload at least one image for the product.',
        //     })
        //     return
        // }

        const formData = {
            ...data,
            images: uploadedImages,
        }

        const url = `${baseUrl}/product/${isUpdate ? 'update' : 'create'}/variant/${currentRow?.id || ''}`

        try {
            const response = await fetch(url, {
                method: isUpdate ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
            // setSelectedFiles([])
            setPreviewUrls([])

            toast({
                title: `Variant ${isUpdate ? 'updated' : 'created'} successfully`,
            })
        } catch (error) {
            //console.error(`Error ${isUpdate ? 'updating' : 'creating'} product:`, error)
            toast({
                title: `Failed to ${isUpdate ? 'update' : 'create'} variant`,
                description: 'Please try again.',
            })
        }
    }
    // const remainingImageSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length;
    // const canAddMoreImages = remainingImageSlots > 0;

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    form.reset()
                    setUploadedImages([])
                    //    setSelectedFiles([])
                    setPreviewUrls([])
                    previewUrls.forEach(url => URL.revokeObjectURL(url))
                }
            }}
        >
            <SheetContent className="flex flex-col overflow-y-auto max-h-screen w-full">
                <SheetHeader className='text-left'>
                    <SheetTitle>
                        {isUpdate ? 'Update' : 'Create'} Variant
                    </SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'Update the variant by providing necessary info.'
                            : 'Add a new variant by providing necessary info.'}
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
                                        <Input {...field} placeholder='Enter the name' />
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
                                        <Textarea {...field} placeholder='Enter the description' rows={2} />
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
                                        <Input {...field} placeholder='Enter the price' type='number' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='stockQuantity'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Stock Quantity</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Enter the stock quantity' type='number' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* isDefault Checkbox */}
                        <FormField
                            control={form.control}
                            name='isDefault'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Default Variant</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="true"
                                            />
                                            <label htmlFor='true' className='ml-2 text-sm text-gray-600'>True</label>
                                            <Checkbox
                                                checked={!field.value}
                                                onCheckedChange={(v) => field.onChange(!v)}
                                                id="false"
                                                className='ml-4'
                                            />
                                            <label htmlFor='false' className='ml-2 text-sm text-gray-600'>False</label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="optionValueIds"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Variant Options</FormLabel>
                                    <FormDescription>
                                        Select one option from each variant type (optional)
                                    </FormDescription>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {availableVariants.length > 0 ? (
                                                availableVariants.map((variant) => (
                                                    <div key={variant.id} className="space-y-2">
                                                        <label className="text-sm font-medium">{variant.name}</label>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center ">
                                                                <Checkbox
                                                                    checked={!(field.value || []).find(id =>
                                                                        variant.values.some(v => v.id === id)
                                                                    )}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            const currentValues = field.value || [];
                                                                            const filteredValues = currentValues.filter(id =>
                                                                                !variant.values.some(v => v.id === id)
                                                                            );
                                                                            field.onChange(filteredValues);
                                                                        }
                                                                    }}
                                                                />
                                                                <label className='ml-2 text-sm text-gray-600'>None</label>
                                                            </div>

                                                           
                                                            {variant.values.map((option) => (
                                                                <div key={option.id} className="flex items-center">
                                                                    <Checkbox
                                                                        checked={(field.value || []).includes(option.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValues = field.value || [];
                                                                            const filteredValues = currentValues.filter(id =>
                                                                                !variant.values.some(v => v.id === id)
                                                                            );
                                                                            const newValues = checked ? [...filteredValues, option.id] : filteredValues;
                                                                            field.onChange(newValues);
                                                                        }}
                                                                    />
                                                                    <label className='ml-2 text-sm text-gray-600'>{option.value}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-500">No variant options available</div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <FormLabel>Variant Images</FormLabel>
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
                        </div> */}


                    </form>
                </Form>
                <SheetFooter className="mt-5 gap-2">
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button form="product-form" type="submit">
                        {isUpdate ? 'Update' : 'Create'} Variant
                    </Button>
                </SheetFooter>
                {/* <AddVariantModal
                    open={isVariantModalOpen}
                    onOpenChange={setIsVariantModalOpen}
                    onSave={handleSaveVariant}
                    existingVariant={currentVariant}
                /> */}
            </SheetContent>
        </Sheet>
    )
}