import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useEffect } from 'react'
import { useUsers } from '@/context/user/user-context'
// import { Link } from '@tanstack/react-router'

export default function SignIn() {
  const {users}=useUsers()
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    const isOtp = sessionStorage.getItem('isOtp')
    if (isOtp === 'true') {
      window.location.href = '/otp'
    }
    if (users!=null) {
      window.location.href = '/'
    }
    if (isAuthenticated === 'true') {
      window.location.href = '/create-brand'
    }
  }
  , [users])
  return (
    <AuthLayout>
      <Card className='p-8 shadow-lg max-w-md w-full'>
        <div className='flex flex-col space-y-4 text-center mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome to BuyBox</h1>
          <p className='text-sm text-muted-foreground'>
            Please sign in to continue to your account
            {/* Enter your email and password below to log into your account. */}
            {/* Don't have an account?{' '}
             <Link
                          to='/sign-up'
                          className='underline underline-offset-4 hover:text-primary'
                        >
                          Sign Up
                        </Link> */}
          </p>
        </div>
        <UserAuthForm />
        {/* <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          By clicking login, you agree to our{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Privacy Policy
          </a>
          .
        </p> */}
      </Card>
    </AuthLayout>
  )
}