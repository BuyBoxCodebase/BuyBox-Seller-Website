import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PinInput, PinInputField } from '@/components/pin-input'

type activationCodeFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  activationCode: z.string().min(1, { message: 'Please enter your activationCode code.' }),
})

export function OtpForm({ className, ...props }: activationCodeFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { activationCode: '' },
  })
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData= {
        ...data,
        activationToken: sessionStorage.getItem('activationToken')
      }
      const response = await fetch(`${baseUrl}/seller/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const resdata = await response.json()
     // console.log(resdata)
     sessionStorage.setItem('token', resdata.accessToken)
      sessionStorage.removeItem('isOtp')
      sessionStorage.removeItem('activationToken')
      sessionStorage.setItem('user', JSON.stringify(resdata.user))
      toast({
        title: 'Success',
        description: 'Account activated successfully',
      })
      navigate({ to: '/seller' })
    } catch (error) {
     // console.log(error)
      toast({
        title: 'Wrong OTP',
        description: 'Wrong activation code',
      })
      setIsLoading(false)
    }
    

    setTimeout(() => {
      setIsLoading(false)
      
    }, 1000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='activationCode'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <PinInput
                      {...field}
                      className='flex h-10 justify-between'
                      onComplete={() => setDisabledBtn(false)}
                      onIncomplete={() => setDisabledBtn(true)}
                    >
                      {Array.from({ length: 7 }, (_, i) => {
                        if (i === 3)
                          return <Separator key={i} orientation='vertical' />
                        return (
                          <PinInputField
                            key={i}
                            component={Input}
                            className={`${form.getFieldState('activationCode').invalid ? 'border-red-500' : ''}`}
                          />
                        )
                      })}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={disabledBtn || isLoading}>
              Verify
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
