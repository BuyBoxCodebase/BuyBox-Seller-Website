import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'

export default function SignIn() {
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    const isOtp = sessionStorage.getItem('isOtp')
    if (isOtp === 'true') {
      window.location.href = '/otp'
    }
    if (isLoggedIn === 'true') {
      window.location.href = '/'
    }
    if (isAuthenticated === 'true') {
      window.location.href = '/create-seller-profile'
    }
  }
  , [])
  return (
    <AuthLayout>
      <Card className='p-8 shadow-lg max-w-md w-full'>
        <div className='flex flex-col space-y-4 text-center mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome to BuyBox</h1>
          <p className='text-sm text-muted-foreground'>
            Sign in with your email and password, or continue with Google.
            <br />
            Don't have an account?{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
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