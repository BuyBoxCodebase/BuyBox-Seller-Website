import { HTMLAttributes, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
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
import { Textarea } from '@/components/ui/textarea'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  description: z.string().nonempty('Description is required'),
  location: z.string().nonempty('Location is required'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, 'Enter your WhatsApp number with country code, e.g. +263 77 123 4567'),
})

export function CreateBrandForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        description: '',
        location: '',
        phoneNumber: '',
    },
  })

  const baseUrl = import.meta.env.VITE_BASE_URL as string;

  // Sellers who signed up with email already gave a phone number; Google sign-ups didn't.
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    fetch(`${baseUrl}/seller/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.seller?.phoneNumber && !form.getValues('phoneNumber')) {
          form.setValue('phoneNumber', data.seller.phoneNumber)
        }
      })
      .catch(() => {})
  }, [baseUrl, form])
  async function onSubmit(formdata: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    const token = sessionStorage.getItem('token')
    const response = await fetch(
        `${baseUrl}/seller/profile/complete`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formdata),
        },
    )
   await response.json()
    sessionStorage.setItem('isLoggedIn', 'true')
    sessionStorage.removeItem('isAuthenticated')
    window.location.href = '/'
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your store name' {...field} />
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
                    <Textarea placeholder='Enter your store description' {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                    <FormItem className='space-y-1'>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder='Enter your store location' {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input type='tel' placeholder='+263 77 123 4567' {...field} />
                  </FormControl>
                  <p className='text-[0.8rem] text-muted-foreground'>
                    We'll send new order alerts to this number on WhatsApp.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Create
            </Button>

           </div>
        </form>
      </Form>
    </div>
  )
}
