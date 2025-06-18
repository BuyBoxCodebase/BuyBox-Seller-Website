import { HTMLAttributes, useState } from 'react'
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
})

export function CreateBrandForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        description: '',
        location: '',
    },
  })

  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  async function onSubmit(formdata: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    const response = await fetch(
        `${baseUrl}/brand/create`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
        },
    )
    const data = await response.json()
   // console.log(data)
    sessionStorage.setItem('brand', JSON.stringify(data.newBrand))
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
            <Button className='mt-2' disabled={isLoading}>
              Create
            </Button>

           </div>
        </form>
      </Form>
    </div>
  )
}
