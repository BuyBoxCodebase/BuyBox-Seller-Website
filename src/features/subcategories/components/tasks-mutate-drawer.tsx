import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
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
import { SubCategory } from '../data/schema'
import useGetAllCategories from '@/hooks/categories/useGetAllCategories'
//updateSubCategory(@Body() body: { subCategoryId: string; categoryId: string, subCategoryName: string, imageUrl: string; }) {
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: SubCategory
  baseUrl?: string
  isCategory?: boolean
}

const formSchema = z.object({
  subCategoryName: z.string().min(1, 'Name is required.'),
  imageUrl: z.string().optional(),
  subCategoryId: z.string().optional(),
  categoryId: z.string().optional(),
})
type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  baseUrl = import.meta.env.VITE_BASE_URL as string,
}: Props) {
  const isUpdate = !!currentRow
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const { categories } = useGetAllCategories();

  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ? {
      subCategoryName: currentRow.name,
      imageUrl: currentRow.imageUrl,
      subCategoryId: currentRow.id,
      categoryId: currentRow.categoryId,
    } : {
      subCategoryName: '',
      imageUrl: '',
      subCategoryId: '',
      categoryId: '',
    },
  })

  useEffect(() => {
    if (isUpdate && currentRow?.imageUrl) {
      setUploadedImageUrl(currentRow.imageUrl)
    } else {
      setUploadedImageUrl(null)
    }
  }, [isUpdate, currentRow, open])

  const onSubmit = async (data: TasksForm) => {
    //console.log('Inside onSubmit')
    //console.log('Data', uploadedImageUrl)
    const formData = {
      ...data,
      imageUrl: uploadedImageUrl || '',
      subCategoryName: data.subCategoryName,
      subCategoryId: data.subCategoryId || currentRow?.id,
      categoryId: data.categoryId || currentRow?.categoryId,
    }
   // console.log(formData)
    const url = `${baseUrl}/category/${isUpdate ? "update" : "create"}/sub-category`
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
        title: `Failed to ${isUpdate ? 'update' : 'create'} Sub category`,
        description: 'Please try again.',
      })
      return
    }
   // const dataa = await response.json()
    //console.log(dataa)
    onOpenChange(false)
    form.reset()
    setUploadedImageUrl(null)
    toast({
      title: `Sub Category ${isUpdate ? 'updated' : 'created'} successfully`,
    })
  }

  const handleFileUpload = (_file: File | null, url?: string) => {
    if (url) {
     // console.log('Inside handleFileUpload')
     // console.log('Url', url)
      setUploadedImageUrl(url)
    } else {
      setUploadedImageUrl(null)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) { // Only reset when closing
          form.reset()
          setUploadedImageUrl(null)
        }
      }}
    >
      <SheetContent className='flex flex-col overflow-y-auto max-h-screen'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'} Sub Category
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the subcategory by providing necessary info.'
              : 'Add a new subcategory by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5'
          >
            <FormField
              control={form.control}
              name='subCategoryName'
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
              name="categoryId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      defaultValue={currentRow?.categoryId}
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
              name='imageUrl'
              render={() => (
                <FormItem className='space-y-1'>
                  <FormLabel>Upload Image (PNG/JPG only)</FormLabel>
                  <FormControl>
                    <FileUpload 
                      baseUrl={baseUrl} 
                      onChange={handleFileUpload} 
                      initialImageUrl={uploadedImageUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}