import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'
import { ResetPasswordForm } from './components/reset-password-form'

export default function ForgotPassword() {
  // The reset email links back here with ?token=..., which switches the page to "set a new password"
  const token = new URLSearchParams(window.location.search).get('token')

  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            {token ? 'Set a new password' : 'Forgot Password'}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {token
              ? "Choose a password you don't use anywhere else."
              : "Enter your registered email and we'll send you a link to reset your password. Signed up with Google? This also lets you add a password."}
          </p>
        </div>
        {token ? <ResetPasswordForm token={token} /> : <ForgotForm />}
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Remembered it?{' '}
          <Link
            to='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Back to sign in
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
