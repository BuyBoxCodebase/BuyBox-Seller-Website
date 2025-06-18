import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { OtpForm } from './components/otp-form'
import { useEffect } from 'react'

export default function Otp() {
  useEffect(() => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated')
      const isLoggedIn = sessionStorage.getItem('isLoggedIn')
      if (isLoggedIn === 'true') {
        window.location.href = '/'
      }
      if (isAuthenticated === 'true') {
        window.location.href = '/create-brand'
      }
    }
    , [])
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Two-factor Authentication
          </h1>
          <p className='text-sm text-muted-foreground'>
            Please enter the authentication code. <br /> We have sent the
            authentication code to your email.
          </p>
        </div>
        <OtpForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Haven't received it?{' '}
          <Link
            to='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Resend a new code.
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
