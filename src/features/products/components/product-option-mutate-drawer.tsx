import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormLabel,
} from '@/components/ui/form'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi'
import { AddVariantModal, Variant } from './add-variant-modal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '../data/schema'
import useGetOptionValues from '@/hooks/variants/useGetOptionValues'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Product
    baseUrl?: string
    isCategory?: boolean
    isUpdate?: boolean
}

const formSchema = z.object({
    productId: z.string().optional(),
})

type ProductForm = z.infer<typeof formSchema>

export function VariantOptionsMutateDrawer({
    open,
    onOpenChange,
    currentRow,
    baseUrl = import.meta.env.VITE_BASE_URL as string,
    isUpdate = false,
}: Props) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [variants, setVariants] = useState<Variant[]>([])
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
    const [currentVariant, setCurrentVariant] = useState<Variant | undefined>(undefined)
    
    // Use the hook when isUpdate is true and we have a currentRow
    const { options, loading } = isUpdate && currentRow?.id 
        ? useGetOptionValues(currentRow.id) 
        : { options: [], loading: false }

    const form = useForm<ProductForm>({
        resolver: zodResolver(formSchema),
        defaultValues: currentRow ? {
            productId: currentRow.id,
        } : {
            productId: '',
        },
    })

    useEffect(() => {
        if (isUpdate && options.length > 0 && !loading) {
            const transformedVariants = options.map(option => ({
                id: option.id,
                name: option.name,
                values: option.values.map(value => ({
                    id: value.id,
                    value: value.value
                }))
            }));
            setVariants(transformedVariants);
        }
    }, [options, loading, isUpdate]);

    const handleSaveVariant = (variant: Variant) => {
        if (currentVariant) {
            setVariants(variants.map(v => v.id === variant.id ? variant : v))
            setCurrentVariant(undefined)
        } else {
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

    const onSubmit = async (data: ProductForm) => {
        const formattedOptions = variants.map(variant => ({
            optionName: variant.name,
            values: variant.values.map(v => v.value)
        }))

        const formData = {
            ...data,
            options: formattedOptions,
        }

        const url = `${baseUrl}/product/add/variant-options`

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
                    title: `Failed to ${isUpdate ? 'update' : 'create'} product variant`,
                    description: 'Please try again.',
                })
                return
            }

            //const responseData = await response.json()
            //console.log(responseData)

            onOpenChange(false)
            form.reset()
            setPreviewUrls([])
            setVariants([])

            toast({
                title: `Product variant ${isUpdate ? 'updated' : 'created'} successfully`,
            })
        } catch (error) {
           // //console.error(`Error ${isUpdate ? 'updating' : 'creating'} product:`, error)
            toast({
                title: `Failed to ${isUpdate ? 'update' : 'create'} product`,
                description: 'Please try again.',
            })
        }
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    form.reset()
                    setPreviewUrls([])
                    setVariants([])
                    previewUrls.forEach(url => URL.revokeObjectURL(url))
                }
            }}
        >
            <SheetContent className="flex flex-col overflow-y-auto max-h-screen w-full">
                <SheetHeader className='text-left'>
                    <SheetTitle>
                        {isUpdate ? 'Update' : 'Create'} Product Variant Options
                    </SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'Update the product variant by providing necessary info.'
                            : 'Add a new product variant by providing necessary info.'}
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                
                {isUpdate && loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-gray-500">Loading variant options...</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            id='product-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex-1 space-y-5 mt-4'
                        >
                            <div className="space-y-3">
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
                            </div>
                        </form>
                    </Form>
                )}
                
                <SheetFooter className="mt-5 gap-2">
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button 
                        form="product-form" 
                        type="submit"
                        disabled={isUpdate && loading}
                    >
                        {isUpdate ? 'Update' : 'Create'} Variant Options
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