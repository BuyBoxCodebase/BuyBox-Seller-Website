import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { PasswordInput } from '@/components/password-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const passwordFormSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

/** Change password, or set a first one for sellers who signed up with Google. */
export function PasswordCard() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const baseUrl = import.meta.env.VITE_BASE_URL as string

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${baseUrl}/seller/profile/password`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        setHasPassword(data.hasPassword)
      } catch {
        setLoadFailed(true)
      }
    }
    fetchStatus()
  }, [baseUrl])

  async function onSubmit(values: PasswordFormValues) {
    if (hasPassword && !values.currentPassword) {
      form.setError('currentPassword', { message: 'Please enter your current password' })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${baseUrl}/seller/profile/password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: hasPassword ? values.currentPassword : undefined,
          newPassword: values.newPassword,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message)
      }
      toast({
        title: hasPassword ? 'Password changed' : 'Password set',
        description: hasPassword ? undefined : 'You can now also sign in with your email and password.',
      })
      setHasPassword(true)
      form.reset()
    } catch (e) {
      toast({
        title: "Couldn't update password",
        description: e instanceof Error && e.message ? e.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Password</CardTitle>
        <CardDescription>
          {hasPassword === false
            ? 'You signed up with Google. Set a password to also sign in with your email.'
            : 'Change the password you use to sign in with your email.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadFailed ? (
          <p className='text-sm text-muted-foreground'>
            Couldn't load your password settings. Refresh the page to try again.
          </p>
        ) : hasPassword === null ? (
          <div className='flex justify-center p-4'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:max-w-sm'>
              {hasPassword && (
                <FormField
                  control={form.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <PasswordInput autoComplete='current-password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <PasswordInput autoComplete='new-password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <PasswordInput autoComplete='new-password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {hasPassword ? 'Change password' : 'Set password'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
