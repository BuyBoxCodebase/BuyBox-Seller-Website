import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { CreateBrandForm } from './components/create-brand-form'
import { useEffect } from 'react'


export default function CreateBrand() {
    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated')
        const isLoggedIn = sessionStorage.getItem('isLoggedIn')
        if (isLoggedIn === 'true') {
          window.location.href = '/'
        }
        if (!isAuthenticated) {
          window.location.href = '/sign-in'
        }
      }
      , [])
  return (
    <AuthLayout>
      <Card className='p-8'>
        <div className='flex flex-col space-y-4 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight text-center'>Create your store</h1>
        </div>
        <CreateBrandForm />
      </Card>
    </AuthLayout>
  )
}

