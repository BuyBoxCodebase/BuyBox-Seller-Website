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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Loader2 } from 'lucide-react'
import { StoreLocationInput } from '@/components/store-location-input'

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
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .nullable(),
  brandPic: z.string().optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, {
      message: 'Enter your WhatsApp number with country code, e.g. +263 77 123 4567.',
    }),
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
      coordinates: null,
      brandPic: '',
      phoneNumber: '',
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
            coordinates: data.seller.coordinates ?? null,
            brandPic: data.seller.brandPic || '',
            phoneNumber: data.seller.phoneNumber || '',
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
        ...(data.coordinates && { coordinates: data.coordinates }),
        brandPic: brandPic || data.brandPic || '',
        phoneNumber: data.phoneNumber,
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
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Store details</CardTitle>
            <CardDescription>What buyers see on your store page.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted'>
                {brandPic ? (
                  <img src={brandPic} alt='Store logo' className='h-full w-full object-cover' />
                ) : (
                  <span className='text-sm font-medium text-muted-foreground'>Logo</span>
                )}
              </div>
              <div className='space-y-1.5'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className='mr-2 h-4 w-4' />
                  {brandPic ? 'Change logo' : 'Upload logo'}
                </Button>
                <p className='text-[0.8rem] text-muted-foreground'>A square image works best.</p>
              </div>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handlePicChange}
              />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Store location</CardTitle>
            <CardDescription>
              Your orders ship from the Treides hub nearest to this point. Until it is set, buyers pay an extra
              transfer fee on your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='coordinates'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <StoreLocationInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Order alerts</CardTitle>
            <CardDescription>New order alerts are sent to this number on WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input type='tel' placeholder='+263 77 123 4567' className='sm:max-w-xs' {...field} />
                  </FormControl>
                  <FormDescription>Include the country code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
