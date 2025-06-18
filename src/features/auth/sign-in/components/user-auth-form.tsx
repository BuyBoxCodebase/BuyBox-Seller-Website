import { HTMLAttributes, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { PasswordInput } from '@/components/password-input'
import { toast } from '@/hooks/use-toast'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const navigate = useNavigate()
  async function onSubmit() {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    try{
      const response = await fetch(`${baseUrl}/seller/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.getValues())
      })
      const data = await response.json()
      sessionStorage.setItem('token', data.accessToken)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      if(!response.ok){
        throw new Error(data.message)
      }
      toast({
        title: 'Account Created',
        description: 'Account created successfully',
      })
      navigate({to:'/seller'})
  }
  catch(e){
    const errorMessage = e instanceof Error ? e.message : 'An error occurred';
    toast({
      title: 'Error',
      description: errorMessage,
    })
  }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${baseUrl}/seller/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json()
      console.log('user data', data)
    }
    fetchUser()
  }, [])
  
  function onGoogleLogin() {
    window.location.href=`${baseUrl}/seller/auth/google`;
    // eslint-disable-next-line no-console
   // console.log('Google clicked');
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            {/* <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Login
            </Button> */}

            {/* <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div> */}

            <div className='flex flex-col items-center gap-4 mt-4'>
              <p className='text-center text-sm font-medium text-muted-foreground'>Sign in with</p>
              <Button
                variant='outline'
                className='w-full py-6 text-base font-medium shadow-sm hover:bg-gray-100 transition-colors border-2'
                type='button'
                disabled={isLoading}
                onClick={onGoogleLogin}
              >
                <IconBrandGoogle className='h-5 w-5 mr-2' /> Continue with Google
              </Button>
              {/* <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button> */}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}