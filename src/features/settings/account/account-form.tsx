import { useEffect, useState, useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Camera, Loader2 } from 'lucide-react'

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Store name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Store name must not be longer than 50 characters.',
    }),
  description: z.string().optional(),
  location: z.string().optional(),
  brandPic: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [brandPic, setBrandPic] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const baseUrl = import.meta.env.VITE_BASE_URL as string

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      brandPic: '',
    },
  })

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await fetch(`${baseUrl}/seller/profile/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (data.success && data.seller) {
          form.reset({
            name: data.seller.name || '',
            description: data.seller.description || '',
            location: data.seller.location || '',
            brandPic: data.seller.brandPic || '',
          })
          setBrandPic(data.seller.brandPic || '')
          sessionStorage.setItem('seller', JSON.stringify(data.seller))
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch seller profile',
          variant: 'destructive',
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchSellerProfile()
  }, [baseUrl, form])

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true)
    try {
      const token = sessionStorage.getItem('token')
      const payload = {
        name: data.name,
        description: data.description || '',
        location: data.location || '',
        brandPic: brandPic || data.brandPic || '',
      }

      const response = await fetch(`${baseUrl}/seller/profile/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const resData = await response.json()
      if (resData.success) {
        toast({
          title: 'Seller Profile Updated',
          description: 'Your store profile information has been successfully saved.',
        })
        // Update local session storage
        const currentSeller = JSON.parse(sessionStorage.getItem('seller') || '{}')
        sessionStorage.setItem(
          'seller',
          JSON.stringify({ ...currentSeller, ...payload })
        )
      } else {
        toast({
          title: 'Update Failed',
          description: resData.message || 'Could not update seller profile.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving profile.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result.toString()
          setBrandPic(resultStr)
          form.setValue('brandPic', resultStr)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (isFetching) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center mb-6'>
          <div className='relative group'>
            <div className='w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center'>
              {brandPic ? (
                <img
                  src={brandPic}
                  alt='Store Logo'
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-xl font-bold text-gray-400'>Logo</span>
              )}
            </div>
            <div
              className='absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90'
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} />
            </div>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/*'
              onChange={handlePicChange}
            />
          </div>
          <FormDescription className='mt-2 text-center'>
            Click camera icon to upload store logo
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your store / brand name' {...field} />
              </FormControl>
              <FormDescription>
                This is the public store name displayed to buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell buyers about your store and products...'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of your store operations or products.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Harare, Zimbabwe' {...field} />
              </FormControl>
              <FormDescription>
                Physical address or operating city of your store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update Seller Profile
        </Button>
      </form>
    </Form>
  )
}
